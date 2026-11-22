import {Training as TrainingMongoModel} from "@src/@infra/models/training/mongoose/training.model";
import Training from "./training.entity";

export default class TrainingFactory {
  static create(model: TrainingMongoModel): Training {
    return {
      id: model._id.toString(),
      name: model.name,
      description: model.description,
      show_to_student: model.show_to_student,
      student_id: model.student_id ?? undefined,
      personal_id: model.personal_id,
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
