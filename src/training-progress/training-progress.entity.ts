import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Exercise } from "@src/exercises/exercise.entity";
import { FINISH_STATUS } from "./enum/finish-status.enum";

@ObjectType()
export default class TrainingProgress {
  @Field(() => ID)
  id: string;

  @Field()
  training_id: string;

  @Field()
  name: string;

  @Field({nullable: true})
  description?: string;

  @Field()
  student_id: string;

  @Field()
  personal_id: string;

  @Field({ nullable: true })
  started_at: Date;

  @Field({ nullable: true })
  finished_at: Date;

  @Field(() => [Exercise], { nullable: true })
  exercises?: Exercise[]

  @Field({ nullable: true })
  finish_feedback: string;

  @Field({ nullable: true })
  finish_status: FINISH_STATUS;
}