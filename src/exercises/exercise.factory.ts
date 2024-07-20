import { Exercise as ExerciseMongoModel } from "src/@infra/models/exercise/mongoose/exercise.model";
import { Exercise } from "src/exercises/exercise.entity";

export default class ExerciseFactory {
  static create(model: ExerciseMongoModel): Exercise {
    return {
      id: model._id.toString(),
      name: model.name,
      personal_id: model.personal_id,
      instructions: model.instructions,
      video: model.video,
      rest: model.rest,
      load: model.load,
      load_progress: model.load_progress,
      series: model.series
    } as Exercise
  }
}