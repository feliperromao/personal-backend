import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../../models/user/mongoose/user.model';
import { CreateStudentInput } from '../../../users/inputs/create-student.input';
import { ObjectId } from 'mongodb';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private model: Model<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  
    async create(dto: CreateStudentInput): Promise<User> {
    const userCreated = new this.model({
      _id: new ObjectId(),
      ...dto,
    });
    return await userCreated.save();
  }

  async findByEmail(email: string): Promise<User> {
    const CACHE_KEY = `user-${email}`;
    const value = await this.cacheManager.get(CACHE_KEY);
    if (value) {
      return {...JSON.parse(value.toString()) } as User
    };
    const user = await this.model.findOne({ email: email }).exec();
    await this.cacheManager.set(CACHE_KEY, JSON.stringify(user));
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.model.find().exec();
  }

  async getAllByPersonal(personal_id: string): Promise<User[]> {
    return await this.model.find({ personal_id: personal_id }).exec();
  }

  async findById(id: string): Promise<User> {
    const CACHE_KEY = `user-${id}`;
    const value = await this.cacheManager.get(CACHE_KEY);
    if (value) {
      return {...JSON.parse(value.toString()) } as User
    };
    const user = await this.model.findOne({_id: new mongoose.Types.ObjectId(id)}).exec();
    await this.cacheManager.set(CACHE_KEY, JSON.stringify(user));
    return user;
  }

  async clear(): Promise<void> {
    await this.model.deleteMany({}).exec();
  }

  async save(user: User[]): Promise<void> {
    await this.model.insertMany(user)
  }

  async update(id: string, data: User): Promise<User> {
    await this.model.findByIdAndUpdate(id, data);
    const CACHE_KEY = `user-${id}`;
    await this.cacheManager.del(CACHE_KEY);
    return await this.model.findById(id);
  }

  async delete(ids: string[]): Promise<void> {
    await this.model.deleteMany({_id: {$in: ids}}).exec();
    for(let id of ids) {
      let CACHE_KEY = `user-${id}`;
      await this.cacheManager.del(CACHE_KEY);
    }
  }
}
