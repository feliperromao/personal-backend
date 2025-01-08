import { Field, ArgsType, ID } from '@nestjs/graphql';

@ArgsType()
export default class DeleteInput {
  @Field(() => [ID])
  id: string;
}