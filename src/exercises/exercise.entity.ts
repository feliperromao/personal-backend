import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InputType('TrainingExerciseInput')
export class Exercise {
  @Field(() => ID, {nullable: true})
  id: string;

  @Field()
  name: string;

  @Field({nullable: true})
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
