import { Injectable } from '@nestjs/common';
import CreateExerciseInput from './inputs/create-exercise.input';
import { ExerciseRepository } from '@src/@infra/repository/exercise/exercise.repository';
import { Exercise } from './exercise.entity';
import ExerciseFactory from '@src/exercises/exercise.factory';
import UpdateExerciseInput from './inputs/update-exercise.input';

@Injectable()
export class ExercisesService {
  constructor(private readonly repository: ExerciseRepository) {}

  async create(exerciseData: CreateExerciseInput): Promise<Exercise> {
    const exercise = await this.repository.create(exerciseData);
    return ExerciseFactory.create(exercise)
  }

  async update(exerciseData: UpdateExerciseInput): Promise<Exercise> {
    const exercise = await this.repository.update(exerciseData);
    return ExerciseFactory.create(exercise)
  }

  async getAllByPersonal(personal_id: string): Promise<Exercise[]> {
    const exercises = await this.repository.getAllByPersonal(personal_id);
    return exercises.map(exercise => ExerciseFactory.create(exercise))
  }

  async delete(ids: string[]): Promise<void> {
    await this.repository.delete(ids);
  }
}
