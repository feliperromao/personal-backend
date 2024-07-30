import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";
import { Exercise } from '../../exercise/mongoose/exercise.model';

@Schema()
export class TrainingProgress extends Document {
  @Prop()
  _id: string;

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

  @Prop({ required: false })
  started_at: Date;

  @Prop({ required: false })
  finished_at: Date;
}

export const TrainingProgressSchema = SchemaFactory.createForClass(TrainingProgress);
