import { Exercise } from "@src/exercises/exercise.entity";
import { FINISH_STATUS } from "./enum/finish-status.enum";

export default class TrainingProgress {
  id: string;

  training_id: string;

  name: string;

  description?: string;

  student_id: string;

  personal_id: string;

  started_at: Date;

  finished_at: Date;

  exercises?: Exercise[]

  finish_feedback: string;

  finish_status: FINISH_STATUS;
}