import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from "mongoose";
import { Exercise } from '../../exercise/mongoose/exercise.model';
import { FINISH_STATUS } from '@src/training-progress/enum/finish-status.enum';

@Schema()
export class TrainingProgress extends Document {
  @Prop()
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  training_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true })
  student_id: string;

  @Prop({ required: true })
  personal_id: string;

  @Prop({ required: false })
  exercises?: Exercise[]
  
  @Prop({ required: false, default: null })
  finish_feedback: string;

  @Prop({ required: false, default: null })
  finish_status: FINISH_STATUS;

  @Prop({ required: false })
  started_at: Date;

  @Prop({ required: false })
  finished_at: Date;
}

export const TrainingProgressSchema = SchemaFactory.createForClass(TrainingProgress);
