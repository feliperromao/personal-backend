import { EXERCISE_TYPE } from '../enum/exercise.type';

export default class CreateExerciseInput {
  name: string;

  type: EXERCISE_TYPE;

  personal_id: string;

  instructions?: string;

  video?: string;

  rest: number;

  load: number;

  load_progress: boolean;

  series: number;
}
