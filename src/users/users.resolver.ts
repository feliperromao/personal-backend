import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { CreateStudentInput } from './inputs/create-student.input';
import { CreatePersonalInput } from './inputs/create-personal.input';

@Resolver(of => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  users() {
    return this.usersService.findAll();
  }

  @Mutation(() => User)
  createStudent(@Args('user') requestData: CreateStudentInput) {
    console.log("🚀 ~ UsersResolver ~ createStudent:", requestData)
    return this.usersService.createStudent(requestData);
  }

  @Mutation(() => User)
  createPersonal(@Args('user') requestData: CreatePersonalInput) {
    console.log("🚀 ~ UsersResolver ~ createPersonal:", requestData)
    return this.usersService.createPersonal(requestData);
  }
}
