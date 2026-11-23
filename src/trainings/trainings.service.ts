import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import Training from './training.entity';
import CreateTrainingInput from './dtos/create-training.dto';
import TrainingsRepository from '@src/@infra/repository/trainings/training.repository';
import TrainingFactory from './training.factory';
import UpdateTrainingInput from './dtos/update-training.dto';
import { USER_TYPE } from '@src/users/enum/user.type';
import { UsersService } from '@src/users/users.service';

@Injectable()
export class TrainingsService {
  constructor(
    protected readonly repository: TrainingsRepository,
    private readonly usersService: UsersService,
  ) {  }

  async searchTraining(personal_id: string, search: string, student_id: string, page: number, limit: number): Promise<{total: number, data: Training[]}> {
    const result = await this.repository.searchTraining(personal_id, search, student_id, page, limit);
    result.data = result.data.map(item => TrainingFactory.create(item));
    return result
  }

  async getAllByPersonal(personal_id: string): Promise<Training[]> {
    const items = await this.repository.getAllByPersonal(personal_id);
    return items.map(item => TrainingFactory.create(item));
  }

  async getAllByStudent(student_id: string): Promise<Training[]> {
    const items = await this.repository.getAllByStudent(student_id);
    return items.map(item => TrainingFactory.create(item));
  }

  async getById(trainingId: string): Promise<Training> {
    const document = await this.repository.findById(trainingId);
    if (!document) {
      throw new NotFoundException(`Training not found (id: ${trainingId})`);
    }
    return TrainingFactory.create(document)
  }

  async getByIdForExecutor(trainingId: string, executorId: string, executorType: USER_TYPE): Promise<Training> {
    const training = await this.getById(trainingId);
    const canAccess = executorType === USER_TYPE.PERSONAL
      ? training.personal_id === executorId
      : training.student_id === executorId && training.show_to_student;

    if (!canAccess) {
      throw new ForbiddenException('Training is not available for this user');
    }
    return training;
  }

  async create(data: CreateTrainingInput): Promise<Training> {
    const [totalTrainings, subscription] = await Promise.all([
      this.repository.countByPersonal(data.personal_id),
      this.usersService.getSubscriptionLimits(data.personal_id),
    ]);
    if (totalTrainings >= subscription.max_training) {
      const resource = subscription.max_training === 1 ? 'treino' : 'treinos';
      throw new BadRequestException(`Limite de ${subscription.max_training} ${resource} do plano ${subscription.name} atingido.`);
    }
    const created = await this.repository.create(this.normalizeStudent(data));
    return TrainingFactory.create(created)
  }

  async update(data: UpdateTrainingInput): Promise<Training>{
    const existing = await this.repository.findById(data.id);
    if (!existing) {
      throw new NotFoundException(`Training not found (id: ${data.id})`);
    }
    if (existing.personal_id !== data.personal_id) {
      throw new ForbiddenException('Training does not belong to this personal');
    }
    return TrainingFactory.create(await this.repository.update(this.normalizeStudent(data)));
  }

  async delete(id: string, personalId?: string): Promise<boolean>{
    if (personalId) {
      const existing = await this.repository.findById(id);
      if (!existing) throw new NotFoundException(`Training not found (id: ${id})`);
      if (existing.personal_id !== personalId) {
        throw new ForbiddenException('Training does not belong to this personal');
      }
    }
    await this.repository.delete(id);
    return true;
  }

  private normalizeStudent<T extends CreateTrainingInput | UpdateTrainingInput>(data: T): T {
    const studentId = data.student_id?.trim() || undefined;
    const exerciseIds = new Set((data.exercises || []).map(exercise => exercise.id));
    const groupedExerciseIds = new Set<string>();
    const groupIds = new Set<string>();
    const exerciseGroups = (data.exercise_groups || []).map(group => {
      const id = group.id?.trim();
      const memberIds = [...new Set(group.exercise_ids || [])];
      const isValid = id
        && !groupIds.has(id)
        && memberIds.length >= 2
        && memberIds.every(exerciseId => exerciseIds.has(exerciseId) && !groupedExerciseIds.has(exerciseId))
        && Number.isInteger(group.series)
        && group.series >= 1
        && Number.isInteger(group.rest)
        && group.rest >= 0;
      if (!isValid) throw new BadRequestException('Exercise groups must contain unique exercises, series and rest');
      groupIds.add(id);
      memberIds.forEach(exerciseId => groupedExerciseIds.add(exerciseId));
      return { id, exercise_ids: memberIds, series: group.series, rest: group.rest };
    });
    return {
      ...data,
      student_id: studentId,
      show_to_student: Boolean(studentId && data.show_to_student),
      exercise_groups: exerciseGroups,
    } as T;
  }
}
