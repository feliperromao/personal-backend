import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from "mongoose";
import { Exercise } from '../../exercise/mongoose/exercise.model';

@Schema({ _id: false })
export class ExerciseGroup {
  @Prop({ required: true })
  id: string;

  @Prop({ type: [String], required: true })
  exercise_ids: string[];

  @Prop({ required: true, min: 1 })
  series: number;

  @Prop({ required: true, min: 0 })
  rest: number;
}

export const ExerciseGroupSchema = SchemaFactory.createForClass(ExerciseGroup);

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

  @Prop({ required: false, default: null })
  student_id?: string;

  @Prop({ required: true })
  personal_id: string;

  @Prop({ required: false })
  exercises?: Exercise[]

  @Prop({ type: [ExerciseGroupSchema], required: false, default: [] })
  exercise_groups?: ExerciseGroup[]
}

export const TrainingSchema = SchemaFactory.createForClass(Training);
