import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '@src/guards/gql-auth.guard';
import { GqlRolesGuard } from '@src/guards/gql-roles.guard';
import { Roles } from '@src/guards/roles.decorator';
import { USER_TYPE } from '@src/users/enum/user.type';
import TrainingProgressInput from './inputs/start-training.input';
import { TrainingProgressService } from './training-progress.service';
import TrainingProgress from './training-progress.entity';

@Resolver()
export class TrainingProgressResolver {
  constructor(private service: TrainingProgressService) {}

  @Mutation(() => TrainingProgress, {name: 'startTraining'})
  @Roles(USER_TYPE.STUDENT)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  async startTraining(@Args() args: TrainingProgressInput): Promise<TrainingProgress> {
    const { id } = args;
    return await this.service.startTraining(id);
  }

  @Mutation(() => Boolean, {name: 'finishTraining'})
  @Roles(USER_TYPE.STUDENT)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  async finishTraining(@Args() args: TrainingProgressInput): Promise<boolean> {
    const { id } = args;
    return await this.service.finishTraining(id);
  }

  @Mutation(() => Boolean, {name: 'cancelTraining'})
  @Roles(USER_TYPE.STUDENT)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  async cancelTraining(@Args() args: TrainingProgressInput): Promise<boolean> {
    const { id } = args;
    return await this.service.cancelTraining(id);
  }
}
