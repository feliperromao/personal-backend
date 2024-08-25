import { Field, ArgsType } from '@nestjs/graphql';
import { FINISH_STATUS } from '../enum/finish-status.enum';

@ArgsType()
export default class TrainingProgressInput {
  @Field()
  id: string;

  @Field({nullable: true})
  status: FINISH_STATUS;

  @Field({nullable: true})
  feedback?: string;
}