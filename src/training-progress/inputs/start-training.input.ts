import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export default class TrainingProgressInput {
  @Field()
  id: string;
}