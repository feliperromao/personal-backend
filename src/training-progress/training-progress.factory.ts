import {TrainingProgress as TrainingProgressMongoModel} from "@src/@infra/models/training-progress/mongoose/training-progress.model";

import TrainingProgress from "./training-progress.entity";

export default class TrainingProgressFactory {
  static create(model: TrainingProgressMongoModel): TrainingProgress {
    return {
      id: model._id.toString(),
      name: model.name,
      description: model.description,
      show_to_student: model.show_to_student,
      student_id: model.student_id,
      personal_id: model.personal_id,
      started_at: model.started_at ?? null,
      finished_at: model.finished_at ?? null,
      exercises: model.exercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        personal_id: exercise.personal_id,
        instructions: exercise.instructions,
        video: exercise.video,
        rest: exercise.rest,
        load: exercise.load,
        load_progress: exercise.load_progress,
        series: exercise.series
      })) || []
    }
  }
}