import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../@infra/repository/user/user.repository';
import { StudentDto } from './dtos/student.dto';
import EncryptPassword from '@src/@infra/encrypt/encrypt.interface';
import Bcrypt from '@src/@infra/encrypt/bcrypt';
import { PersonalDto } from './dtos/personal.dto';
import { USER_TYPE } from '@src/users/enum/user.type';
import { User } from './user.entity';
import { StudentFactory } from './user.factory';

@Injectable()
export class UsersService {
  private encrypt: EncryptPassword;
  constructor(private readonly repository: UserRepository) {
    this.encrypt = new Bcrypt();
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async getAllPersonals() {
    return await this.repository.getAllPersonals();
  }

  async listAllByPersonal(personal_id: string) {
    const result = await this.repository.listAllByPersonal(personal_id);
    return result.map(student => StudentFactory.create(student))
  }

  async getByPersonal(personal_id: string, search: string = '', page: number = 1, limit: number =10) {
    const result = await this.repository.getByPersonal(personal_id, search, page, limit);
    result.data = result.data.map(student => StudentFactory.create(student))
    return result; 
  }

  async findById(id: string): Promise<User> {
    const model = await this.repository.findById(id);
    return StudentFactory.create(model);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const model = await this.repository.findByEmail(email);
    if (!model) return null;
    return StudentFactory.create(model)
  }

  async createStudent(data: StudentDto): Promise<User> {
    const totalStudents = await this.repository.countStudents(data.personal_id);
    const maxStudents: number = 10;

    if (totalStudents >= maxStudents) {
      throw new BadRequestException("Maximo de alunos cadastrados");
    }

    return await this.createUser({
      ...data,
      type: USER_TYPE.STUDENT
    });
  }

  async createPersonal(data: PersonalDto): Promise<User> {
    return await this.createUser({
      ...data,
      type: USER_TYPE.PERSONAL
    });
  }

  async updateStudents(userData): Promise<User> {
    userData.type = USER_TYPE.STUDENT;
    return this.updateUser(userData)
  }

  async updatePersonal(userData): Promise<User> {
    userData.type = USER_TYPE.PERSONAL;
    return this.updateUser(userData)
  }

  async deleteUsers(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private async createUser(data): Promise<User> {
    const checkIfUserExists = await this.findByEmail(data.email);
    if (checkIfUserExists) {
      throw new BadRequestException("user already exists");
    }
    const userCrated = await this.repository.create({
      ...data,
      blocked: false,
      password: await this.encrypt.encrypt(data.password)
    });
    return StudentFactory.create(userCrated);
  }

  private async updateUser(userData): Promise<User> {
    const checkIfUserExists = await this.findByEmail(userData.email);
    if (checkIfUserExists && userData.id != checkIfUserExists.id) {
      throw new BadRequestException("user already exists");
    }

    if (userData.password) {
      userData.password = await this.encrypt.encrypt(userData.password);
    }
    const { id } = userData;
    delete userData.id;
    const model = await this.repository.update(id, userData);
    return StudentFactory.create(model);
  }
}
