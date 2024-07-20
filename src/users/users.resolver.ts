import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateStudentInput } from './inputs/create-student.input';
import { CreatePersonalInput } from './inputs/create-personal.input';
import { Roles } from 'src/guards/roles.decorator';
import { USER_TYPE } from 'src/users/enum/user.type';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { GqlRolesGuard } from 'src/guards/gql-roles.guard';
import GetUsersInput from './inputs/get-users.input';

@Resolver(of => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  @Roles(USER_TYPE.PERSONAL)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  users(@Args() args: GetUsersInput) {
    const { personal_id } = args
    return this.usersService.getAllByPersonal(personal_id);
  }

  @Mutation(() => User)
  @Roles(USER_TYPE.PERSONAL)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  async createStudent(@Args('user') requestData: CreateStudentInput,): Promise<User> {
    const user = await this.usersService.createStudent(requestData);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      blocked: user.blocked,
      personal_id: user.personal_id,
    } as User
  }

  @Mutation(() => User)
  @Roles(USER_TYPE.ADMIN)
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  async createPersonal(@Args('user') requestData: CreatePersonalInput): Promise<User> {
    const user = await this.usersService.createPersonal(requestData);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
    } as User
  }
}
