import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { USER_TYPE } from '@src/users/enum/user.type';
import { Roles } from '@src/guards/roles.decorator';
import { Exercise } from './exercise.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@src/guards/gql-auth.guard';
import { RolesGuard } from '@src/guards/roles.guard';
import CreateExerciseInput from './inputs/create-exercise.input';
import { ExercisesService } from './exercises.service';
import GetExercisesInput from './inputs/get-exercises.input';
import DeleteInput from '@src/@shared/gql-inputs/delete.input';
import UpdateExerciseInput from './inputs/update-exercise.input';

@Resolver(of => Exercise)
export class ExercisesResolver {
  constructor(private service: ExercisesService) {}
  
  @Mutation(() => Exercise)
  @Roles(USER_TYPE.PERSONAL)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createExercise(@Args('exercise') exerciseData: CreateExerciseInput): Promise<Exercise> {
    return await this.service.create(exerciseData);
  }

  @Mutation(() => Exercise)
  @Roles(USER_TYPE.PERSONAL)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateExercise(@Args('exercise') exerciseData: UpdateExerciseInput): Promise<Exercise> {
    return await this.service.update(exerciseData);
  }

  @Query(() => [Exercise])
  @Roles(USER_TYPE.PERSONAL)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getAllExercises(@Args() args: GetExercisesInput){
    const { personal_id } = args
    return this.service.getAllByPersonal(personal_id);
  }

  @Mutation(() => Boolean, {name: 'deleteExercise'})
  @Roles(USER_TYPE.PERSONAL)
  @UseGuards(GqlAuthGuard, RolesGuard)
  deleteExercise(@Args() args: DeleteInput){
    const { id } = args
    try {
      this.service.delete(id);
      return true;
    } catch (error) {
      return false;
    }
  }
}
