import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import Training from './training.entity';
import CreateTrainingInput from './dtos/create-training.dto';
import TrainingsRepository from '@src/@infra/repository/trainings/training.repository';
import TrainingFactory from './training.factory';
import UpdateTrainingInput from './dtos/update-training.dto';
import { USER_TYPE } from '@src/users/enum/user.type';

@Injectable()
export class TrainingsService {
  constructor(protected readonly repository: TrainingsRepository) {  }

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
    return {
      ...data,
      student_id: studentId,
      show_to_student: Boolean(studentId && data.show_to_student),
    } as T;
  }
}
