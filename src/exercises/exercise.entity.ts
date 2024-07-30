import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InputType('TrainingExerciseInput')
export class Exercise {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  personal_id: string;

  @Field()
  instructions: string;

  @Field()
  video: string;

  @Field()
  rest: number;

  @Field()
  load: number;

  @Field()
  load_progress: boolean;

  @Field()
  series: number;
}
