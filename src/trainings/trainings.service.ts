import { Injectable } from '@nestjs/common';
import Training from './training.entity';
import CreateTrainingInput from './inputs/create-training.input';
import TrainingsRepository from '@src/@infra/repository/trainings/training.repository';
import TrainingFactory from './training.factory';
import UpdateTrainingInput from './inputs/update-training.input';

@Injectable()
export class TrainingsService {
  constructor(protected readonly repository: TrainingsRepository) {  }

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
    return TrainingFactory.create(document)
  }

  async create(data: CreateTrainingInput): Promise<Training> {
    const created = await this.repository.create(data);
    return TrainingFactory.create(created)
  }

  async update(data: UpdateTrainingInput): Promise<Training>{
    return TrainingFactory.create(await this.repository.update(data));
  }

  async delete(id: string): Promise<boolean>{
    await this.repository.delete(id);
    return true;
  }
}
