import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  password: string;

  @Field()
  email: string;

  @Field()
  blocked: boolean;

  @Field()
  type: string;

  @Field()
  personal_id: string;
}
