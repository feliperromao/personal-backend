import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserInput } from './create-user.input';

@Resolver(of => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(returns => [User])
  users() {
    console.log('resolver users');
    return this.usersService.findAll();
  }

  @Query(returns => User)
  user(@Args('id') id: number) {
    return this.usersService.findOneById(id);
  }

  @Mutation(returns => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    console.log("🚀 ~ UsersResolver ~ createUser ~ createUserInput:", createUserInput)
    return this.usersService.createUser(createUserInput);
  }
}
