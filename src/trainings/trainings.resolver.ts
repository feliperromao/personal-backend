import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import Training from './training.entity';
import { Roles } from '@src/guards/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@src/guards/gql-auth.guard';
import { GqlRolesGuard } from '@src/guards/gql-roles.guard';
import { USER_TYPE } from '@src/users/enum/user.type';
import { TrainingsService } from './trainings.service';
import GetTrainingsInput from './inputs/get-trainings.input';
import CreateTrainingInput from './inputs/create-training.input';
import StudentFilterInput from '@src/@shared/gql-inputs/student-filter.input';
import UpdateTrainingInput from './inputs/update-training.input';
import DeleteInput from '@src/@shared/gql-inputs/delete.input';

@Resolver(of => Training)
export class TrainingsResolver {
  constructor(private service: TrainingsService) {}

  @Query(() => [Training])
  @Roles(USER_TYPE.PERSONAL)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  async trainings(@Args() args: GetTrainingsInput): Promise<Training[]> {
    const { personal_id } = args
    return await this.service.getAllByPersonal(personal_id);
  }

  @Query(() => [Training])
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  async studentTrainigs(@Args() args: StudentFilterInput): Promise<Training[]> {
    const { student_id } = args
    return await this.service.getAllByStudent(student_id);
  }

  @Mutation(() => Training, {name: 'createTraining'})
  @Roles(USER_TYPE.PERSONAL)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  async createTraining(@Args('training') data: CreateTrainingInput): Promise<Training> {
    return await this.service.create(data)
  }

  @Mutation(() => Training, {name: 'updateTraining'})
  @Roles(USER_TYPE.PERSONAL)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  async updateTraining(@Args('training') inputData: UpdateTrainingInput): Promise<Training> {
    return await this.service.update(inputData)
  }

  @Mutation(() => Boolean, {name: 'deleteTraining'})
  @Roles(USER_TYPE.PERSONAL)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  async deleteTraining(@Args() args: DeleteInput): Promise<boolean> {
    const { ids } = args
    try {
      this.service.delete(ids);
      return true;
    } catch (error) {
      return false;
    }
  }
}
