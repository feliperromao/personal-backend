import { EXERCISE_TYPE } from '@src/exercises/enum/exercise.type';

export interface ExerciseDto {
  name: string;
  personal_id: string;
  instructions?: string;
  type: EXERCISE_TYPE;
  video?: string;
  rest: number;
  load: number;
  series: number;
  load_progress: boolean
}
