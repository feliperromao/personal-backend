import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { TrainingProgress } from "@src/@infra/models/training-progress/mongoose/training-progress.model";
import Training from "@src/trainings/training.entity";

export default class TrainingProgressRepository {
  constructor(@InjectModel(TrainingProgress.name) private model: Model<TrainingProgress>) { }
  
  async startTraining(training: Training): Promise<TrainingProgress> {
    const currentTraining = {
      ...training,
      _id: new ObjectId(),
      started_at: new Date()
    }
    console.log("🚀 ~ TrainingProgressRepository ~ currentTraining:", JSON.stringify(currentTraining))
    return await this.model.create(currentTraining);
  }

  async finishTraining(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(id, { finished_at: new Date() });
    return !!result;
  }

  async findById(id: string): Promise<TrainingProgress> {
    return await this.model.findOne({_id: id}).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}