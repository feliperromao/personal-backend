import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../../models/user/mongoose/user.model';
import { StudentDto } from '../../../users/dtos/student.dto';
import { ObjectId } from 'mongodb';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { USER_TYPE } from '@src/users/enum/user.type';

@Injectable()
export class UserRepository {

  constructor(
    @InjectModel(User.name) private model: Model<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  
    async create(dto: StudentDto): Promise<User> {
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

  async getAllPersonals(): Promise<User[]> {
    return await this.model.find({type: USER_TYPE.PERSONAL}).exec();
  }

  async listAllByPersonal(personal_id) {
    const fieldsSelection = {id: true, name: true, email: true, blocked: true };
    return this.model.find({ personal_id: personal_id }, fieldsSelection).exec();
  }

  async countStudents(personal_id: string): Promise<number> {
    return await this.model.countDocuments({ personal_id: personal_id }).exec();
  }

  async getByPersonal(personal_id: string, search: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const fieldsSelection = {password: false };
    let query
    let queryCountDocuments
    if (search === '') {
      query = this.model.find({ personal_id: personal_id }, fieldsSelection)
      queryCountDocuments = this.model.find({ personal_id: personal_id })
    } else {
      query = this.model.find({ personal_id: personal_id, name: {$regex: search, $options: 'i'} })
      queryCountDocuments = this.model.find({ personal_id: personal_id, name: {$regex: search, $options: 'i'} })
    }

    const total = await queryCountDocuments.countDocuments().exec();
    const data = await query.skip(skip).limit(limit).exec();
    return { total, data }
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
    await this.model.findByIdAndUpdate(new mongoose.Types.ObjectId(id), data);
    const CACHE_KEY = `user-${id}`;
    await this.cacheManager.del(CACHE_KEY);
    return await this.model.findById(new mongoose.Types.ObjectId(id));
  }

  async delete(id: string): Promise<void> {
    let CACHE_KEY = `user-${id}`;
    await this.cacheManager.del(CACHE_KEY);
    await this.model.findByIdAndDelete(new mongoose.Types.ObjectId(id)).exec();
  }
}
