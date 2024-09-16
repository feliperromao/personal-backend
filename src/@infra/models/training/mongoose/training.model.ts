import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from "mongoose";
import { Exercise } from '../../exercise/mongoose/exercise.model';

@Schema()
export class Training extends Document {
  @Prop()
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true })
  show_to_student: boolean;

  @Prop({ required: true })
  student_id: string;

  @Prop({ required: true })
  personal_id: string;

  @Prop({ required: false })
  exercises?: Exercise[]
}

export const TrainingSchema = SchemaFactory.createForClass(Training);
