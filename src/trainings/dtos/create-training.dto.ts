import { Exercise } from '@src/exercises/exercise.entity';

export default class CreateTrainingDto {
  name: string;

  description?: string;

  show_to_student: boolean;

  student_id: string;
  
  personal_id: string;

  exercises?: Exercise[]
}