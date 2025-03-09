import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Exercise } from "@src/@infra/models/exercise/mongoose/exercise.model";
import { CreateExerciseDto } from "@src/exercises/dtos/create-exercise.dto";
import { UpdateExerciseDto } from "@src/exercises/dtos/update-exercise.dto";

@Injectable()
export class ExerciseRepository {
  constructor(@InjectModel(Exercise.name) private model: Model<Exercise>) { }

  async create(exerciseData: CreateExerciseDto): Promise<Exercise> {
    const exerciseCreated = new this.model({
      _id: new ObjectId(),
      ...exerciseData,
    });
    return await exerciseCreated.save();
  }

  async update(data: UpdateExerciseDto): Promise<Exercise> {
    const { id } = data;
    delete data.id;
    await this.model.findByIdAndUpdate(new mongoose.Types.ObjectId(id), data);
    return await this.model.findById(new mongoose.Types.ObjectId(id));
  }

  async findById(id: string): Promise<Exercise> {
    return await this.model.findById(new mongoose.Types.ObjectId(id));
  }

  async getAllByPersonal(personal_id: string, search: string, exercise_type: string = '', page: number, limit: number) {
    const skip = (page - 1) * limit;
    let data;
    let total;

    let query = {
      personal_id: personal_id
    }

    if (search) {
      query['name'] = { $regex: search, $options: 'i' }
    }

    if (exercise_type) {
      query['type'] = exercise_type
    }

    data = await this.model.find(query).skip(skip).limit(limit).exec();
    total = await this.model.find(query).countDocuments();

    return { total, data }
  }

  async getDefaultExercises(): Promise<Exercise[]> {
    return await this.model.find({ "personal_id": "" })
  }

  async delete(id: string): Promise<void> {
    this.model.findByIdAndDelete(new mongoose.Types.ObjectId(id)).exec();
  }
}