import { EXERCISE_TYPE } from "../enum/exercise.type";

export interface UpdateExerciseDto {
  id: string;
  name: string;
  personal_id: string;
  instructions?: string;
  type: EXERCISE_TYPE;
  video?: string;
  rest: number;
  load: number;
  load_progress: boolean;
  series: number;
}
