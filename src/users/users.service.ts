import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserInput } from './create-user.input';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UserRepository) {}
  async findAll() {
    return await this.repository.findAll();
  }

  findOneById(id: number) {
    return `user ${id}`;
  }

  async createUser(dto: CreateUserInput): Promise<User> {
    return await this.repository.create({
      ...dto,
      password: this.encryptPassword(dto.password)
    });
  }

  //TODO: implement
  encryptPassword(password: string) {
    return `hashed:start-${password}-end`;
  }
}
