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

  async startTraining(
    training: Training,
    executor_id: string,
    executor_type: USER_TYPE,
    last_loads: Record<string, number> = {},
  ): Promise<TrainingProgress> {
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
      exercise_groups: training.exercise_groups,
      completed_series: [],
      last_loads,
      finish_feedback: null,
      finish_status: null,
      started_at: new Date()
    }
    return await this.model.create(currentTraining);
  }

  async findLastLoadsByExecutor(
    executor_id: string,
    executor_type: USER_TYPE,
    exercise_ids: string[],
  ): Promise<Record<string, number>> {
    if (!exercise_ids.length) return {};

    const executorFilters: Record<string, unknown>[] = [
      { executor_id, executor_type },
      { executor_id, executor_type: { $exists: false } },
    ];
    if (executor_type === USER_TYPE.STUDENT) {
      executorFilters.push({ executor_id: { $exists: false }, student_id: executor_id });
    }

    const histories = await this.model.find({
      $or: executorFilters,
      'completed_series.exercise_id': { $in: exercise_ids },
    }).select({ completed_series: 1, started_at: 1, finished_at: 1 }).exec();

    const latest = new Map<string, { load: number; completedAt: number }>();
    histories.forEach((history) => {
      (history.completed_series || []).forEach((item) => {
        if (!exercise_ids.includes(item.exercise_id) || !Number.isFinite(item.load)) return;
        const completedAt = item.completed_at?.getTime()
          ?? history.finished_at?.getTime()
          ?? history.started_at?.getTime()
          ?? 0;
        const current = latest.get(item.exercise_id);
        if (!current || completedAt >= current.completedAt) {
          latest.set(item.exercise_id, { load: item.load, completedAt });
        }
      });
    });

    return Object.fromEntries(Array.from(latest, ([exerciseId, value]) => [exerciseId, value.load]));
  }

  async finishTraining(id: string, executor_id: string, status: FINISH_STATUS, feedback: string = null): Promise<TrainingProgress> {
    const data = {
      finished_at: new Date(),
      finish_feedback: feedback,
      finish_status: status
    };
    return await this.model.findOneAndUpdate({
      _id: new mongoose.Types.ObjectId(id),
      $or: [
        { executor_id },
        { executor_id: { $exists: false }, student_id: executor_id },
      ],
      finished_at: { $exists: false }
    }, data, { new: true }).exec();
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

  async findFinishedByExecutor(executor_id: string, executor_type: USER_TYPE): Promise<TrainingProgress[]> {
    const executorFilters: Record<string, unknown>[] = [
      { executor_id, executor_type },
      { executor_id, executor_type: { $exists: false } },
    ];
    if (executor_type === USER_TYPE.STUDENT) {
      executorFilters.push({ executor_id: { $exists: false }, student_id: executor_id });
    }

    return await this.model.find({
      finished_at: { $ne: null },
      $or: executorFilters,
    }).sort({ finished_at: 1, started_at: 1 }).exec();
  }

  async findFinishedAtByExecutorBetween(
    executor_id: string,
    executor_type: USER_TYPE,
    start: Date,
    end: Date,
  ): Promise<Date[]> {
    const executorFilters: Record<string, unknown>[] = [
      { executor_id, executor_type },
      { executor_id, executor_type: { $exists: false } },
    ];
    if (executor_type === USER_TYPE.STUDENT) {
      executorFilters.push({ executor_id: { $exists: false }, student_id: executor_id });
    }

    const executions = await this.model.find({
      finished_at: { $gte: start, $lt: end },
      $or: executorFilters,
    }).select({ finished_at: 1 }).sort({ finished_at: 1 }).exec();

    return executions.map((execution) => execution.finished_at);
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

  async recordCompletedSeriesBatch(id: string, executor_id: string, items: CompletedSeries[]): Promise<TrainingProgress> {
    const progress = await this.findActiveByIdForExecutor(id, executor_id);
    if (!progress) return null;

    const history = progress.completed_series || [];
    items.forEach((completedSeries) => {
      const existingIndex = history.findIndex(item =>
        item.exercise_id === completedSeries.exercise_id && item.series === completedSeries.series
      );
      if (existingIndex >= 0) history[existingIndex] = completedSeries;
      else history.push(completedSeries);
    });

    progress.completed_series = history;
    await progress.save();
    return progress;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(new mongoose.Types.ObjectId(id));
    return !!result;
  }
}
