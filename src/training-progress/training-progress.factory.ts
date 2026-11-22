import {TrainingProgress as TrainingProgressMongoModel} from "@src/@infra/models/training-progress/mongoose/training-progress.model";

import TrainingProgress from "./training-progress.entity";

export default class TrainingProgressFactory {
  static create(model: TrainingProgressMongoModel): TrainingProgress {
    return {
      id: model._id.toString(),
      training_id: model.training_id,
      name: model.name,
      description: model.description,
      student_id: model.student_id ?? undefined,
      personal_id: model.personal_id,
      executor_id: model.executor_id,
      executor_type: model.executor_type,
      started_at: model.started_at ?? null,
      finished_at: model.finished_at ?? null,
      finish_feedback: model.finish_feedback ?? null,
      finish_status: model.finish_status ?? null,
      last_loads: model.last_loads instanceof Map
        ? Object.fromEntries(model.last_loads)
        : (model.last_loads || {}),
      completed_series: model.completed_series?.map(item => ({
        exercise_id: item.exercise_id,
        series: item.series,
        load: item.load,
        completed_at: item.completed_at
      })) || [],
      exercises: model.exercises?.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        type: exercise.type,
        personal_id: exercise.personal_id,
        instructions: exercise.instructions,
        video: exercise.video,
        rest: exercise.rest,
        series: exercise.series
      })) || [],
      exercise_groups: model.exercise_groups?.map(group => ({
        id: group.id,
        exercise_ids: [...group.exercise_ids],
        series: group.series,
        rest: group.rest,
      })) || []
    }
  }
}
