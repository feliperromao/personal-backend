import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../@infra/repository/user/user.repository';
import { StudentDto } from './dtos/student.dto';
import EncryptPassword from '@src/@infra/encrypt/encrypt.interface';
import Bcrypt from '@src/@infra/encrypt/bcrypt';
import { PersonalDto } from './dtos/personal.dto';
import { USER_TYPE } from '@src/users/enum/user.type';
import { User } from './user.entity';
import { StudentFactory } from './user.factory';
import { SubscriptionRepository } from '@src/@infra/repository/subscriptions/subscription.repository';
import { Subscription } from '@src/subscriptions/subscription.entity';
import SubscriptionFactory from '@src/subscriptions/subscription.factory';

@Injectable()
export class UsersService {
  private encrypt: EncryptPassword;
  constructor(
    private readonly repository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {
    this.encrypt = new Bcrypt();
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async getAllPersonals() {
    const result = await this.repository.getAllPersonals();
    return result.map(personal => StudentFactory.create(personal));
  }

  async listAllByPersonal(personal_id: string) {
    const result = await this.repository.listAllByPersonal(personal_id);
    return result.map(student => StudentFactory.create(student))
  }

  async getByPersonal(personal_id: string, search: string = '', page: number = 1, limit: number =10): Promise<{total: number, data: User[]}> {
    const result = await this.repository.getByPersonal(personal_id, search, page, limit);
    result.data = result.data.map(student => StudentFactory.create(student))
    return result; 
  }

  async findById(id: string): Promise<User | null> {
    const model = await this.repository.findById(id);
    if (!model) return null;
    return StudentFactory.create(model);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const model = await this.repository.findByEmail(email);
    if (!model) return null;
    return StudentFactory.create(model)
  }

  async createStudent(data: StudentDto): Promise<User> {
    if (data.password !== data.confirm_password) {
      throw new BadRequestException("Senhas invalidas");
    }

    const totalStudents = await this.repository.countStudents(data.personal_id);
    const subscription = await this.getSubscriptionLimits(data.personal_id);

    if (totalStudents >= subscription.max_students) {
      const resource = subscription.max_students === 1 ? 'aluno' : 'alunos';
      throw new BadRequestException(`Limite de ${subscription.max_students} ${resource} do plano ${subscription.name} atingido.`);
    }

    return await this.createUser({
      ...data,
      type: USER_TYPE.STUDENT
    });
  }

  async createPersonal(data: PersonalDto): Promise<User> {
    await this.ensureSubscriptionExists(data.subscription_id);
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
    await this.ensureSubscriptionExists(userData.subscription_id);
    userData.type = USER_TYPE.PERSONAL;
    return this.updateUser(userData)
  }

  async getSubscriptionLimits(personalId: string): Promise<Subscription> {
    const personal = await this.findById(personalId);
    if (!personal || personal.type !== USER_TYPE.PERSONAL) {
      throw new BadRequestException('Personal não encontrado.');
    }
    if (!personal.subscription_id) {
      throw new BadRequestException('Personal não possui plano de assinatura associado.');
    }

    const document = await this.subscriptionRepository.findById(personal.subscription_id);
    if (!document) {
      throw new BadRequestException('O plano associado ao personal não existe mais.');
    }
    return SubscriptionFactory.create(document);
  }

  async deleteUsers(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async changePassword(userId: string, password: string): Promise<boolean> {
    const encryptedPassword = await this.encrypt.encrypt(password);
    const user = await this.repository.updatePassword(userId, encryptedPassword);
    return Boolean(user);
  }

  private async createUser(data): Promise<User> {
    const checkIfUserExists = await this.findByEmail(data.email);
    if (checkIfUserExists) {
      throw new BadRequestException("user already exists");
    }
    const userCrated = await this.repository.create({
      ...data,
      blocked: data.blocked ?? false,
      password: await this.encrypt.encrypt(data.password)
    });
    return StudentFactory.create(userCrated);
  }

  private async ensureSubscriptionExists(subscriptionId: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new BadRequestException('Plano de assinatura inválido.');
    }
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
