import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import {Training} from "@src/@infra/models/training/mongoose/training.model";
import CreateTrainingInput from "@src/trainings/inputs/create-training.input";
import UpdateTrainingInput from "@src/trainings/inputs/update-training.input";

export default class TrainingsRepository {
  constructor(@InjectModel(Training.name) private model: Model<Training>) { }

  async getAllByPersonal(personal_id: string): Promise<Training[]> {
    return await this.model.find({ personal_id });
  }

  async getAllByStudent(student_id: string): Promise<Training[]> {
    return await this.model.find({ student_id });
  }

  async create(data: CreateTrainingInput): Promise<Training> {
    const trainingCreated = new this.model({
      _id: new ObjectId(),
      ...data
    });

    return await trainingCreated.save();
  }

  async update(data: UpdateTrainingInput): Promise<Training> {
    const { id } = data;
    delete data.id;
    await this.model.findByIdAndUpdate(id, data);
    return await this.model.findById(id);
  }

  async delete(ids: string[]) {
    await this.model.deleteMany({ _id: {$in: ids} })
  }

  async findById(id: string): Promise<Training> {
    return await this.model.findById(id);
  }
}