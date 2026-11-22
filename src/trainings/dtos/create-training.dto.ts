import { Exercise } from '@src/exercises/exercise.entity';
import { ExerciseGroup } from '../training.entity';

export default class CreateTrainingDto {
  name: string;

  description?: string;

  show_to_student: boolean;

  student_id?: string;
  
  personal_id: string;

  exercises?: Exercise[]

  exercise_groups?: ExerciseGroup[]
}
