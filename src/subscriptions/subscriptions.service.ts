import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Subscription } from './subscription.entity';
import { SubscriptionRepository } from '@src/@infra/repository/subscriptions/subscription.repository';
import { SubscriptionDto } from './dtos/create-subscription.dto';
import SubscriptionFactory from './subscription.factory';
import { UserRepository } from '@src/@infra/repository/user/user.repository';


@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly repository: SubscriptionRepository,
    private readonly userRepository: UserRepository,
  ) { }

  async findAll(): Promise<Subscription[]> {
    const documents = await this.repository.findAll();
    return documents.map(document => SubscriptionFactory.create(document))
  }

  async create(data: SubscriptionDto): Promise<Subscription> {
    const document = await this.repository.create(data);
    return SubscriptionFactory.create(document);
  }

  async update(id: string, data: SubscriptionDto): Promise<Subscription> {
    const document = await this.repository.update(id, data);
    if (!document) {
      throw new NotFoundException('Plano não encontrado.');
    }
    return SubscriptionFactory.create(document);
  }

  async delete(id: string): Promise<void> {
    const personalsUsingPlan = await this.userRepository.countPersonalsBySubscription(id);
    if (personalsUsingPlan > 0) {
      throw new ConflictException('Este plano está associado a um ou mais personals e não pode ser excluído.');
    }
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Plano não encontrado.');
    }
  }
}
