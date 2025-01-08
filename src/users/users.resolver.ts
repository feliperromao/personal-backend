import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateStudentInput } from './inputs/create-student.input';
import { CreatePersonalInput } from './inputs/create-personal.input';
import { Roles } from '@src/guards/roles.decorator';
import { USER_TYPE } from '@src/users/enum/user.type';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@src/guards/gql-auth.guard';
import { RolesGuard } from '@src/guards/roles.guard';
import GetUsersInput from './inputs/get-users.input';
import DeleteInput from '@src/@shared/gql-inputs/delete.input';
import { UpdateStudentInput } from './inputs/update-student.input';

@Resolver(of => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User], {name: 'listStudents'})
  @Roles(USER_TYPE.PERSONAL)
  @UseGuards(GqlAuthGuard, RolesGuard)
  listStudents(@Args() args: GetUsersInput) {
    const { personal_id } = args
    return this.usersService.getAllByPersonal(personal_id);
  }

  @Mutation(() => User)
  @Roles(USER_TYPE.PERSONAL)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createStudent(@Args('user') requestData: CreateStudentInput,): Promise<User> {
    return await this.usersService.createStudent(requestData);
  }

  @Mutation(() => Boolean, {name: 'deleteStudents'})
  @Roles(USER_TYPE.PERSONAL)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async deleteStudents(@Args() args: DeleteInput,): Promise<boolean> {
    const { id } = args
    try {
      await this.usersService.deleteUsers(id);
      return true
    } catch (error) {
      return false;
    }
  }

  @Mutation(() => User)
  @Roles(USER_TYPE.PERSONAL)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateStudents(@Args('user') requestData: UpdateStudentInput): Promise<User> {
    return await this.usersService.updateStudents(requestData);
  }

  @Mutation(() => User)
  @Roles(USER_TYPE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createPersonal(@Args('user') requestData: CreatePersonalInput): Promise<User> {
    return await this.usersService.createPersonal(requestData);
  }
}
