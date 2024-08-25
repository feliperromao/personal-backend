import { Injectable, NotFoundException } from '@nestjs/common';
import TrainingProgressRepository from '@src/@infra/repository/training-progress/training-progress.repository';
import TrainingsRepository from '@src/@infra/repository/trainings/training.repository';
import TrainingProgress from './training-progress.entity';
import TrainingProgressFactory from './training-progress.factory';
import TrainingFactory from '@src/trainings/training.factory';
import { FINISH_STATUS } from './enum/finish-status.enum';

@Injectable()
export class TrainingProgressService {
  constructor(
    protected readonly repository: TrainingProgressRepository,
    protected readonly trainingRepository: TrainingsRepository,
  ) { }

  async startTraining(id: string): Promise<TrainingProgress> {
    const training = await this.trainingRepository.findById(id);
    if (!training) {
      throw new NotFoundException(`Training not found (id: ${id})`);
    };
    const trainingEntity = TrainingFactory.create(training);
    const model = await this.repository.startTraining(trainingEntity);
    return TrainingProgressFactory.create(model)
  }

  async finishTraining(id: string, status: FINISH_STATUS, feedback: string = null): Promise<TrainingProgress> {
    const training = await this.repository.findById(id);
    if (!training) {
      throw new NotFoundException(`TrainingProgress not found (id: ${id})`);
    };
    const model = await this.repository.finishTraining(id, status, feedback );
    return TrainingProgressFactory.create(model)
  }

  async cancelTraining(id: string): Promise<boolean> {
    const training = await this.repository.findById(id);
    if (!training) {
      throw new NotFoundException(`TrainingProgress not found (id: ${id})`);
    };
    return await this.repository.delete(id);
  }
}
