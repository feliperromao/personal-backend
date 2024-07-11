import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../@infra/users/models/mongoose/user.model';
import { CreateStudentInput } from './inputs/create-student.input';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(dto: CreateStudentInput): Promise<User> {
    const userCreated = new this.userModel({
      _id: new ObjectId(),
      ...dto,
    });
    return await userCreated.save();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
}
