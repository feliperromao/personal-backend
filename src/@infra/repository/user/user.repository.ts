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
    const savedUser = await userCreated.save();
    await this.cacheManager.del(`user-${savedUser.email}`);
    return savedUser;
  }

  async findByEmail(email: string): Promise<User> {
    const CACHE_KEY = `user-${email}`;
    const value = await this.cacheManager.get(CACHE_KEY);
    if (value) {
      const cachedUser = JSON.parse(value.toString());
      if (cachedUser) return { ...cachedUser } as User;
    };
    const user = await this.model.findOne({ email: email }).exec();
    if (user) await this.cacheManager.set(CACHE_KEY, JSON.stringify(user));
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
    const objectId = new mongoose.Types.ObjectId(id);
    const currentUser = await this.model.findById(objectId).exec();
    await this.model.findByIdAndUpdate(objectId, data);
    await Promise.all([
      this.cacheManager.del(`user-${id}`),
      currentUser?.email ? this.cacheManager.del(`user-${currentUser.email}`) : Promise.resolve(),
      data.email ? this.cacheManager.del(`user-${data.email}`) : Promise.resolve(),
    ]);
    return await this.model.findById(objectId);
  }

  async updatePassword(id: string, encryptedPassword: string): Promise<User | null> {
    const user = await this.model.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { password: encryptedPassword },
      { new: true },
    ).exec();

    if (user) {
      await Promise.all([
        this.cacheManager.del(`user-${user.id}`),
        this.cacheManager.del(`user-${user.email}`),
      ]);
    }

    return user;
  }

  async delete(id: string): Promise<void> {
    const objectId = new mongoose.Types.ObjectId(id);
    const user = await this.model.findById(objectId).exec();
    await Promise.all([
      this.cacheManager.del(`user-${id}`),
      user?.email ? this.cacheManager.del(`user-${user.email}`) : Promise.resolve(),
    ]);
    await this.model.findByIdAndDelete(objectId).exec();
  }
}
