import { Exercise } from "@src/exercises/exercise.entity";
import { FINISH_STATUS } from "./enum/finish-status.enum";
import { USER_TYPE } from "@src/users/enum/user.type";
import { ExerciseGroup } from "@src/trainings/training.entity";

export class CompletedSeries {
  exercise_id: string;
  series: number;
  load: number;
  completed_at: Date;
}

export default class TrainingProgress {
  id: string;

  training_id: string;

  name: string;

  description?: string;

  student_id?: string;

  personal_id: string;

  executor_id?: string;

  executor_type?: USER_TYPE;

  started_at: Date;

  finished_at: Date;

  exercises?: Exercise[]

  exercise_groups?: ExerciseGroup[]

  completed_series?: CompletedSeries[];

  last_loads?: Record<string, number>;

  finish_feedback: string;

  finish_status: FINISH_STATUS;
}
