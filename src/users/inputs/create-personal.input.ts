import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePersonalInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  blocked: boolean;
}
