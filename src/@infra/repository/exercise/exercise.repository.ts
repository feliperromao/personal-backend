import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Exercise } from "@src/@infra/models/exercise/mongoose/exercise.model";
import CreateExerciseInput from "@src/exercises/inputs/create-exercise.input";
import UpdateExerciseInput from "@src/exercises/inputs/update-exercise.input";

@Injectable()
export class ExerciseRepository {
  constructor(@InjectModel(Exercise.name) private model: Model<Exercise>) { }
  
  async create(exerciseData: CreateExerciseInput): Promise<Exercise> {
    const exerciseCreated = new this.model({
      _id: new ObjectId(),
      ...exerciseData,
    });
    return await exerciseCreated.save();
  }

  async update(data: UpdateExerciseInput): Promise<Exercise> {
    const { id } = data;
    delete data.id;
    await this.model.findByIdAndUpdate(new mongoose.Types.ObjectId(id), data);
    return await this.model.findById(new mongoose.Types.ObjectId(id));
  }

  async findById(id: string): Promise<Exercise> {
    return await this.model.findById(new mongoose.Types.ObjectId(id));
  }

  async getAllByPersonal(personal_id: string): Promise<Exercise[]> {
    return await this.model.find({ personal_id })
  }

  async getDefaultExercises(): Promise<Exercise[]> {
    return await this.model.find({ "personal_id": "" })
  }

  async delete(ids: string[]): Promise<void> {
    for(let id of ids) {
      this.model.findByIdAndDelete(new mongoose.Types.ObjectId(id)).exec();
    }
  }
}