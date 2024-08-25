import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { TrainingProgress } from "@src/@infra/models/training-progress/mongoose/training-progress.model";
import Training from "@src/trainings/training.entity";
import { FINISH_STATUS } from "@src/training-progress/enum/finish-status.enum";

export default class TrainingProgressRepository {
  constructor(@InjectModel(TrainingProgress.name) private model: Model<TrainingProgress>) { }
  
  async startTraining(training: Training): Promise<TrainingProgress> {
    const training_id = training.id
    delete training.id;
    const currentTraining = {
      _id: new ObjectId(),
      training_id: training_id,
      name: training.name,
      description: training.description ?? null,
      student_id: training.student_id,
      personal_id: training.personal_id,
      exercises: training.exercises,
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
    await this.model.findByIdAndUpdate(id, data);
    return this.findById(id);
  }

  async findById(id: string): Promise<TrainingProgress> {
    return await this.model.findOne({_id: id}).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}