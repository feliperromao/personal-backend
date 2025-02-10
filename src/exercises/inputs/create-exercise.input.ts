import { Field, InputType } from '@nestjs/graphql';
import { EXERCISE_TYPE } from '../enum/exercise.type';

@InputType()
export default class CreateExerciseInput {
  @Field()
  name: string;

  @Field()
  type: EXERCISE_TYPE;

  @Field()
  personal_id: string;

  @Field({nullable: true})
  instructions?: string;

  @Field({nullable: true})
  video?: string;

  @Field()
  rest: number;

  @Field()
  load: number;

  @Field()
  load_progress: boolean;

  @Field()
  series: number;
}
