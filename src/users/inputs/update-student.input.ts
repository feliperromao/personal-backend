import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateStudentInput {
  @Field(() => ID)
  id: string;

  @IsString()
  @Field()
  name: string;

  @IsString()
  @Field()
  email: string;

  @IsString()
  @Field({ nullable: true })
  password: string;

  @IsString()
  @Field()
  personal_id: string;
}
