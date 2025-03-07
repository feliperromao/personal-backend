
export default class UpdateExerciseInput {
  id: string;

  name: string;

  personal_id: string;

  instructions?: string;

  video?: string;

  rest: number;

  load: number;

  load_progress: boolean;

  series: number;
}
