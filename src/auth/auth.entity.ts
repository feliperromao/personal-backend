import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@src/users/user.entity';

@ObjectType()
export class Auth {
  @Field()
  token: string;

  @Field()
  user: User;
}
