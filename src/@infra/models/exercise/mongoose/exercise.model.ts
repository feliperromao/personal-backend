import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from "mongoose";

@Schema()
export class Exercise extends Document {
  @Prop()
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  personal_id: string;

  @Prop({ required: false })
  instructions: string;

  @Prop({ required: false })
  video: string;

  @Prop({ required: false })
  rest: number;

  @Prop({ required: false })
  load: number;

  @Prop({ required: true })
  load_progress: boolean;

  @Prop({ required: true })
  series: number;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
