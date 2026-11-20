import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import mongoose, { Model } from "mongoose";
import { CompletedSeries, TrainingProgress } from "@src/@infra/models/training-progress/mongoose/training-progress.model";
import Training from "@src/trainings/training.entity";
import { FINISH_STATUS } from "@src/training-progress/enum/finish-status.enum";
import { USER_TYPE } from "@src/users/enum/user.type";

export default class TrainingProgressRepository {
  constructor(@InjectModel(TrainingProgress.name) private model: Model<TrainingProgress>) { }
  
  async getCurrentTraining(executor_id: string): Promise<TrainingProgress> {
    return await this.model.findOne({
      $or: [
        { executor_id },
        { executor_id: { $exists: false }, student_id: executor_id },
      ],
      finished_at: { $exists: false }
    })
  }

  async startTraining(training: Training, executor_id: string, executor_type: USER_TYPE): Promise<TrainingProgress> {
    const training_id = training.id
    const currentTraining = {
      _id: new ObjectId(),
      training_id: training_id,
      name: training.name,
      description: training.description ?? null,
      student_id: training.student_id,
      personal_id: training.personal_id,
      executor_id,
      executor_type,
      exercises: training.exercises,
      completed_series: [],
      finish_feedback: null,
      finish_status: null,
      started_at: new Date()
    }
    return await this.model.create(currentTraining);
  }

  async finishTraining(id: string, status: FINISH_STATUS, feedback: string = null): Promise<TrainingProgress> {
    const data = {
      finished_at: new Date(),
      finish_feedback: feedback,
      finish_status: status
    };
    await this.model.findByIdAndUpdate(new mongoose.Types.ObjectId(id), data);
    return this.findById(id);
  }

  async findById(id: string): Promise<TrainingProgress> {
    return await this.model.findOne({_id: new mongoose.Types.ObjectId(id)}).exec();
  }

  async findByIdForExecutor(id: string, executor_id: string): Promise<TrainingProgress> {
    return await this.model.findOne({
      _id: new mongoose.Types.ObjectId(id),
      $or: [
        { executor_id },
        { executor_id: { $exists: false }, student_id: executor_id },
      ],
    }).exec();
  }

  async findActiveByIdForExecutor(id: string, executor_id: string): Promise<TrainingProgress> {
    return await this.model.findOne({
      _id: new mongoose.Types.ObjectId(id),
      $or: [
        { executor_id },
        { executor_id: { $exists: false }, student_id: executor_id },
      ],
      finished_at: { $exists: false }
    }).exec();
  }

  async recordCompletedSeries(id: string, executor_id: string, completedSeries: CompletedSeries): Promise<TrainingProgress> {
    const progress = await this.findActiveByIdForExecutor(id, executor_id);
    if (!progress) return null;

    const history = progress.completed_series || [];
    const existingIndex = history.findIndex(item =>
      item.exercise_id === completedSeries.exercise_id && item.series === completedSeries.series
    );

    if (existingIndex >= 0) history[existingIndex] = completedSeries;
    else history.push(completedSeries);

    progress.completed_series = history;
    await progress.save();
    return progress;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(new mongoose.Types.ObjectId(id));
    return !!result;
  }
}
