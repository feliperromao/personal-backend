import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from "mongoose";
import { Exercise } from '../../exercise/mongoose/exercise.model';
import { FINISH_STATUS } from '@src/training-progress/enum/finish-status.enum';
import { USER_TYPE } from '@src/users/enum/user.type';

@Schema({ _id: false })
export class CompletedSeries {
  @Prop({ required: true })
  exercise_id: string;

  @Prop({ required: true })
  series: number;

  @Prop({ required: true })
  load: number;

  @Prop({ required: true })
  completed_at: Date;
}

export const CompletedSeriesSchema = SchemaFactory.createForClass(CompletedSeries);

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

  @Prop({ required: false, default: null })
  student_id?: string;

  @Prop({ required: true })
  personal_id: string;

  @Prop({ required: false })
  executor_id?: string;

  @Prop({ required: false, enum: USER_TYPE })
  executor_type?: USER_TYPE;

  @Prop({ required: false })
  exercises?: Exercise[]

  @Prop({ type: [CompletedSeriesSchema], required: false, default: [] })
  completed_series?: CompletedSeries[];
  
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
