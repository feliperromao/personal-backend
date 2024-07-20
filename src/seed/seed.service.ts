import { Injectable } from '@nestjs/common';
import Bcrypt from 'src/@infra/encrypt/bcrypt';
import { ObjectId } from 'mongodb';
import { UserRepository } from 'src/@infra/repository/user/user.repository';
import { USER_TYPE } from 'src/users/enum/user.type';
import { User } from 'src/@infra/models/user/mongoose/user.model';

@Injectable()
export class SeedService {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  async runSeed() {
    // Limpar a tabela se necessário
    if (process.env.CLEAR_USERS) {
      await this.userRepository.clear();
    }

    // Dados para popular a tabela
    const encrypt = new Bcrypt();
    const password = await encrypt.encrypt(process.env.SEED_PWD)
    const admin = {
      _id: new ObjectId().toString(),
      name: 'Administrador',
      email: 'admin@fsoft.com',
      blocked: false,
      password: password,
      type: USER_TYPE.ADMIN,
      personal_id: ""
    } as User
    const personal = {
      _id: new ObjectId().toString(),
      name: 'Personal',
      email: 'personal@fsoft.com',
      blocked: false,
      password: password,
      type: USER_TYPE.PERSONAL,
      personal_id: null
    } as User

    const users = [admin, personal];

    // Inserir os dados
    await this.userRepository.save(users);
  }
}