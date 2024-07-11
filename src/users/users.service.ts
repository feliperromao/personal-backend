import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserRepository } from './user.repository';
import { CreateStudentInput } from './inputs/create-student.input';
import EncryptPassword from 'src/@infra/encrypt/encrypt.interface';
import Bcrypt from 'src/@infra/encrypt/bcrypt';
import { CreatePersonalInput } from './inputs/create-personal.input';
import UserFactory from './user.factory';
import { USER_TYPE } from './enum/user.type';

@Injectable()
export class UsersService {
  private encrypt: EncryptPassword;
  constructor(private readonly repository: UserRepository) {
    this.encrypt = new Bcrypt();
  }
  async findAll() {
    return await this.repository.findAll();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const model = await this.repository.findByEmail(email);
    if (!model) return null;
    return UserFactory.create(model)
  }

  async createStudent(data: CreateStudentInput): Promise<User> {
    return await this.createUser({
      ...data,
      type: USER_TYPE.STUDENT
    });
  }

  async createPersonal(data: CreatePersonalInput): Promise<User> {
    return await this.createUser({
      ...data,
      type: USER_TYPE.PERSONAL
    });
  }

  private async createUser(data): Promise<User> {
    const checkIfUserExists = await this.findByEmail(data.email);
    if (checkIfUserExists) throw new Error('User already exists');
    const userCrated = await this.repository.create({
      ...data,
      password: await this.encrypt.encrypt(data.password)
    });
    return UserFactory.create(userCrated);
  }
}
