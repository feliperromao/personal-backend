import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreatePersonalInput {
  @Field()
  @IsString()
  name: string;

  @IsString()
  @Field()
  email: string;

  @IsString()
  @Field()
  password: string;
}
