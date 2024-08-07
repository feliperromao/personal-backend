import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
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
    await this.model.findByIdAndUpdate(id, data);
    return await this.model.findById(id);
  }

  async getAllByPersonal(personal_id: string): Promise<Exercise[]> {
    return await this.model.find({ personal_id })
  }

  async delete(ids: string[]): Promise<void> {
    await this.model.deleteMany({ _id: {$in: ids} })
  }
}