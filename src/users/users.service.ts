import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserInput } from './inputs/create-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UserRepository) {}
  async findAll() {
    return await this.repository.findAll();
  }

  findOneById(id: number) {
    return `user ${id}`;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.repository.findByEmail(email);
  }

  async createUser(dto: CreateUserInput): Promise<User> {
    return await this.repository.create({
      ...dto,
      password: await this.encryptPassword(dto.password)
    });
  }

  async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
