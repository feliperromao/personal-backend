import { Injectable, NotFoundException } from '@nestjs/common';
import { Subscription } from './subscription.entity';
import { SubscriptionRepository } from '@src/@infra/repository/subscriptions/subscription.repository';
import { SubscriptionDto } from './dtos/create-subscription.dto';
import SubscriptionFactory from './subscription.factory';


@Injectable()
export class SubscriptionsService {
  constructor(private readonly repository: SubscriptionRepository) { }

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
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Plano não encontrado.');
    }
  }
}
