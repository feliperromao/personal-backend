import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Subscription extends Document {
  @Prop()
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  max_students: number;

  @Prop({ required: true })
  max_exercises: number;

  @Prop({ required: true })
  max_training: number;

  @Prop({ required: true })
  price_brl: number;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
