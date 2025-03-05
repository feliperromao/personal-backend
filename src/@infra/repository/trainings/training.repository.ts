import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import mongoose, { Model } from "mongoose";
import {Training} from "@src/@infra/models/training/mongoose/training.model";
import CreateTrainingInput from "@src/trainings/inputs/create-training.input";
import UpdateTrainingInput from "@src/trainings/inputs/update-training.input";

export default class TrainingsRepository {
  constructor(@InjectModel(Training.name) private model: Model<Training>) { }

  async searchTraining(personal_id: string, search: string, student_id: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    let data;
    let total: number;

    let query = {
      personal_id: personal_id
    }

    if (search) {
      query['name'] = { $regex: search, $options: 'i' }
    }

    if (student_id ) {
      query['student_id'] = student_id
    }
    
    data = await this.model.find(query).skip(skip).limit(limit).exec();
    total = await this.model.find(query).countDocuments();

    return { total, data }
  }

  async getAllByPersonal(personal_id: string): Promise<Training[]> {
    return await this.model.find({ personal_id });
  }

  async getAllByStudent(student_id: string): Promise<Training[]> {
    return await this.model.find({ student_id, show_to_student: true });
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
    await this.model.findByIdAndUpdate(new mongoose.Types.ObjectId(id), data);
    return await this.model.findById(new mongoose.Types.ObjectId(id));
  }

  async delete(id: string) {
    this.model.findByIdAndDelete(new mongoose.Types.ObjectId(id)).exec();
  }

  async findById(id: string): Promise<Training> {
    return await this.model.findOne({_id: new mongoose.Types.ObjectId(id)}).exec();
  }
}