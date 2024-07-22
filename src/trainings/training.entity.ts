import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Exercise } from "src/exercises/exercise.entity";

@ObjectType()
export default class Training {
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

  @Field(() => [Exercise], {nullable: true})
  exercises?: Exercise[]
}