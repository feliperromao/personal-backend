import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExerciseDto } from '@src/exercises/dtos/exercise.dto';
import { ExerciseRepository } from '@src/@infra/repository/exercise/exercise.repository';
import { Exercise } from './exercise.entity';
import ExerciseFactory from '@src/exercises/exercise.factory';
import { UsersService } from '@src/users/users.service';

@Injectable()
export class ExercisesService {
  constructor(
    private readonly repository: ExerciseRepository,
    private readonly usersService: UsersService,
  ) { }

  async create(exerciseData: ExerciseDto): Promise<Exercise> {
    const [totalExercises, subscription] = await Promise.all([
      this.repository.countByPersonal(exerciseData.personal_id),
      this.usersService.getSubscriptionLimits(exerciseData.personal_id),
    ]);
    if (totalExercises >= subscription.max_exercises) {
      const resource = subscription.max_exercises === 1 ? 'exercício' : 'exercícios';
      throw new BadRequestException(`Limite de ${subscription.max_exercises} ${resource} do plano ${subscription.name} atingido.`);
    }
    const exercise = await this.repository.create(exerciseData);
    return ExerciseFactory.create(exercise)
  }

  async update(id: string, exerciseData: ExerciseDto): Promise<Exercise> {
    const exercise = await this.repository.update(id, exerciseData);
    return ExerciseFactory.create(exercise)
  }

  async getAllByPersonal(personal_id: string, search: string = '', exercise_type: string = '', page: number = 1, limit: number = 10): Promise<{total: number, data: Exercise[]}> {
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
