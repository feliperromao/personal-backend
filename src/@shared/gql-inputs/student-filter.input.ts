import { Field, ArgsType, ID } from '@nestjs/graphql';

@ArgsType()
export default class StudentFilterInput {
  @Field()
  student_id: string;
}