import { Exercise } from "@src/exercises/exercise.entity";

export class ExerciseGroup {
  id: string;

  exercise_ids: string[];

  series: number;

  rest: number;
}

export default class Training {
  id: string;

  name: string;

  description?: string;

  show_to_student: boolean;

  student_id?: string;

  personal_id: string;

  exercises?: Exercise[]

  exercise_groups?: ExerciseGroup[]
}
