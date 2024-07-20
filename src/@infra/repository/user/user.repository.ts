import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../models/user/mongoose/user.model';
import { CreateStudentInput } from '../../../users/inputs/create-student.input';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private model: Model<User>) {}
  async create(dto: CreateStudentInput): Promise<User> {
    const userCreated = new this.model({
      _id: new ObjectId(),
      ...dto,
    });
    return await userCreated.save();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.model.findOne({ email: email }).exec();
  }

  async findAll(): Promise<User[]> {
    return await this.model.find().exec();
  }

  async getAllByPersonal(personal_id: string): Promise<User[]> {
    return await this.model.find({ personal_id: personal_id }).exec();
  }

  async findById(id: string): Promise<User> {
    return await this.model.findOne({_id: id}).exec();
  }

  async clear(): Promise<void> {
    await this.model.deleteMany({}).exec();
  }

  async save(user: User[]): Promise<void> {
    await this.model.insertMany(user)
  }
}
