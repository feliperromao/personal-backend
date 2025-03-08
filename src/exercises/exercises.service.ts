import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateExerciseDto } from '@src/exercises/dtos/create-exercise.dto';
import { ExerciseRepository } from '@src/@infra/repository/exercise/exercise.repository';
import { Exercise } from './exercise.entity';
import ExerciseFactory from '@src/exercises/exercise.factory';
import { UpdateExerciseDto } from './dtos/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(private readonly repository: ExerciseRepository) { }

  async create(exerciseData: CreateExerciseDto): Promise<Exercise> {
    const exercise = await this.repository.create(exerciseData);
    return ExerciseFactory.create(exercise)
  }

  async update(exerciseData: UpdateExerciseDto): Promise<Exercise> {
    const exercise = await this.repository.update(exerciseData);
    return ExerciseFactory.create(exercise)
  }

  async getAllByPersonal(personal_id: string, search: string = '', exercise_type: string = '', page: number = 1, limit: number = 10) {
    const result = await this.repository.getAllByPersonal(personal_id, search, exercise_type, page, limit);
    result.data = result.data.map(exercise => ExerciseFactory.create(exercise))
    return result
  }

  async getDefaultExercises(): Promise<Exercise[]> {
    const exercises = await this.repository.getDefaultExercises();
    return exercises.map(exercise => ExerciseFactory.create(exercise))
  }

  async delete(id: string): Promise<void> {
    const exercise = await this.repository.findById(id)
    if (exercise.personal_id === "") {
      throw new HttpException("could not delete default exercise", HttpStatus.FORBIDDEN)
    }
    await this.repository.delete(id);
  }
}
