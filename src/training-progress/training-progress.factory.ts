import {TrainingProgress as TrainingProgressMongoModel} from "@src/@infra/models/training-progress/mongoose/training-progress.model";

import TrainingProgress from "./training-progress.entity";

export default class TrainingProgressFactory {
  static create(model: TrainingProgressMongoModel): TrainingProgress {
    return {
      id: model._id.toString(),
      training_id: model.training_id,
      name: model.name,
      description: model.description,
      student_id: model.student_id,
      personal_id: model.personal_id,
      started_at: model.started_at ?? null,
      finished_at: model.finished_at ?? null,
      finish_feedback: model.finish_feedback ?? null,
      finish_status: model.finish_status ?? null,
      exercises: model.exercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        type: exercise.type,
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