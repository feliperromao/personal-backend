import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import TrainingProgressRepository from '@src/@infra/repository/training-progress/training-progress.repository';
import TrainingsRepository from '@src/@infra/repository/trainings/training.repository';
import TrainingProgress from './training-progress.entity';
import TrainingProgressFactory from './training-progress.factory';
import TrainingFactory from '@src/trainings/training.factory';
import { FINISH_STATUS } from './enum/finish-status.enum';
import { USER_TYPE } from '@src/users/enum/user.type';
import Training from '@src/trainings/training.entity';

@Injectable()
export class TrainingProgressService {
  constructor(
    protected readonly repository: TrainingProgressRepository,
    protected readonly trainingRepository: TrainingsRepository,
  ) { }

  async getCurrentTraining(executorId: string): Promise<TrainingProgress>  {
    const model = await this.repository.getCurrentTraining(executorId);
    if (model) {
      return TrainingProgressFactory.create(model) 
    }
    return null
  }

  async getWeeklyActivity(executorId: string, executorType: USER_TYPE, startValue: string, endValue: string) {
    const start = new Date(startValue);
    const end = new Date(endValue);
    const maximumRange = 8 * 24 * 60 * 60 * 1000;

    if (end <= start || end.getTime() - start.getTime() > maximumRange) {
      throw new BadRequestException('Weekly activity range must be between 1 and 8 days');
    }

    const completedAt = await this.repository.findFinishedAtByExecutorBetween(executorId, executorType, start, end);
    return { completed_at: completedAt };
  }

  async startTraining(id: string, executorId: string, executorType: USER_TYPE): Promise<TrainingProgress> {
    const training = await this.trainingRepository.findById(id);
    if (!training) {
      throw new NotFoundException(`Training not found (id: ${id})`);
    };
    const trainingEntity = TrainingFactory.create(training);
    this.ensureCanExecute(trainingEntity, executorId, executorType);
    const current = await this.repository.getCurrentTraining(executorId);
    if (current) {
      throw new BadRequestException('There is already a training in progress');
    }
    const exerciseIds = (trainingEntity.exercises || []).map((exercise) => exercise.id);
    const lastLoads = await this.repository.findLastLoadsByExecutor(executorId, executorType, exerciseIds);
    const model = await this.repository.startTraining(trainingEntity, executorId, executorType, lastLoads);
    return TrainingProgressFactory.create(model)
  }

  async finishTraining(id: string, status: FINISH_STATUS, executorId: string, feedback: string = null): Promise<TrainingProgress> {
    const model = await this.repository.finishTraining(id, executorId, status, feedback);
    if (!model) {
      throw new NotFoundException(`TrainingProgress not found (id: ${id})`);
    };
    return TrainingProgressFactory.create(model)
  }

  async completeSeries(id: string, executorId: string, exercise_id: string, series: number, load: number): Promise<TrainingProgress> {
    const progress = await this.repository.findActiveByIdForExecutor(id, executorId);
    if (!progress) {
      throw new NotFoundException(`Active TrainingProgress not found (id: ${id})`);
    }

    const exercise = progress.exercises?.find(item => item.id === exercise_id);
    if (!exercise) {
      throw new BadRequestException('Exercise does not belong to this training progress');
    }
    if (series > exercise.series) {
      throw new BadRequestException(`Series must be between 1 and ${exercise.series}`);
    }

    const model = await this.repository.recordCompletedSeries(id, executorId, {
      exercise_id,
      series,
      load,
      completed_at: new Date()
    });
    return TrainingProgressFactory.create(model);
  }

  async completeGroupSeries(
    id: string,
    executorId: string,
    groupId: string,
    series: number,
    exerciseLoads: Array<{ exercise_id: string; load: number }>,
  ): Promise<TrainingProgress> {
    const progress = await this.repository.findActiveByIdForExecutor(id, executorId);
    if (!progress) {
      throw new NotFoundException(`Active TrainingProgress not found (id: ${id})`);
    }

    const group = progress.exercise_groups?.find(item => item.id === groupId);
    if (!group) throw new BadRequestException('Exercise group does not belong to this training progress');
    if (series > group.series) {
      throw new BadRequestException(`Series must be between 1 and ${group.series}`);
    }

    const expectedIds = [...new Set(group.exercise_ids)];
    const receivedIds = exerciseLoads.map(item => item.exercise_id);
    const hasExactExercises = expectedIds.length >= 2
      && receivedIds.length === expectedIds.length
      && new Set(receivedIds).size === receivedIds.length
      && expectedIds.every(exerciseId => receivedIds.includes(exerciseId))
      && expectedIds.every(exerciseId => progress.exercises?.some(exercise => exercise.id === exerciseId));
    if (!hasExactExercises) {
      throw new BadRequestException('All exercises in the group must be completed together');
    }

    const completedAt = new Date();
    const model = await this.repository.recordCompletedSeriesBatch(
      id,
      executorId,
      exerciseLoads.map(item => ({
        exercise_id: item.exercise_id,
        series,
        load: item.load,
        completed_at: completedAt,
      })),
    );
    return TrainingProgressFactory.create(model);
  }

  async cancelTraining(id: string, executorId: string): Promise<boolean> {
    const training = await this.repository.findByIdForExecutor(id, executorId);
    if (!training) {
      throw new NotFoundException(`TrainingProgress not found (id: ${id})`);
    };
    return await this.repository.delete(id);
  }

  private ensureCanExecute(training: Training, executorId: string, executorType: USER_TYPE) {
    const canExecute = executorType === USER_TYPE.PERSONAL
      ? training.personal_id === executorId
      : training.student_id === executorId && training.show_to_student;

    if (!canExecute) {
      throw new ForbiddenException('Training is not available for this user');
    }
  }
}
