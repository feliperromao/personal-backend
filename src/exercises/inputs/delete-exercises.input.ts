import { Field, ArgsType, ID } from '@nestjs/graphql';

@ArgsType()
export default class DeleteExercisesInput {
  @Field(() => [ID])
  ids: string[];
}