import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { User as UserEntity } from './user.entity'
import { CreateUserInput } from './create-user.input';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(dto: CreateUserInput): Promise<any> {
    const userCreated = new this.userModel(dto);
    await userCreated.save();
    
    console.log("🚀 ~ UserRepository ~ create ~ userCreated:", userCreated)

    return {
      id: userCreated.id.toString(),
      name: userCreated.name,
      email: userCreated.email,
      blocked: userCreated.blocked,
      personal_id: userCreated.personal_id,
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
