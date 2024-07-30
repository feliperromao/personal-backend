import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Exercise } from "@src/exercises/exercise.entity";

@ObjectType()
export default class TrainingProgress {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({nullable: true})
  description?: string;

  @Field()
  show_to_student: boolean;

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
}