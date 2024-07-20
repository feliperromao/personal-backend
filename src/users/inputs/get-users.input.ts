import { Field, ArgsType, ID } from '@nestjs/graphql';

@ArgsType()
export default class GetUsersInput {
  @Field(() => ID, {nullable: true})
  id: string;

  @Field()
  personal_id: string;

  @Field({nullable: true})
  name: string;
}