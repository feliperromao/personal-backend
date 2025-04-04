import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { USER_TYPE } from '@src/users/enum/user.type';

@Schema()
export class User extends Document {
  @Prop()
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  personal_id?: string;

  @Prop({ required: true })
  type: USER_TYPE;

  @Prop({ required: true })
  blocked: boolean;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: false })
  birthdate: string;

  @Prop({ required: false })
  weight: number;

  @Prop({ required: false })
  height: number;

  @Prop({ required: false })
  monthly_value_brl: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
