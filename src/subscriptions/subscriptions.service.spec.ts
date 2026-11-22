import { NotFoundException } from '@nestjs/common';
import { SubscriptionRepository } from '@src/@infra/repository/subscriptions/subscription.repository';
import { SubscriptionsService } from './subscriptions.service';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let repository: jest.Mocked<Pick<SubscriptionRepository, 'findAll' | 'create' | 'update' | 'delete'>>;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new SubscriptionsService(repository as unknown as SubscriptionRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('updates a subscription plan', async () => {
    const document = { _id: { toString: () => 'plan-1' }, name: 'Pro', max_students: 20, max_exercises: 100, max_training: 40, price_brl: 89.9 };
    repository.update.mockResolvedValue(document as never);

    await expect(service.update('plan-1', { name: 'Pro', max_students: 20, max_exercises: 100, max_training: 40, price_brl: 89.9 }))
      .resolves.toEqual({ id: 'plan-1', name: 'Pro', max_students: 20, max_exercises: 100, max_training: 40, price_brl: 89.9 });
  });

  it('reports a missing subscription plan', async () => {
    repository.update.mockResolvedValue(null);
    await expect(service.update('missing', { name: 'Pro', max_students: 20, max_exercises: 100, max_training: 40, price_brl: 89.9 }))
      .rejects.toThrow(new NotFoundException('Plano não encontrado.'));
  });

  it('deletes a subscription plan', async () => {
    repository.delete.mockResolvedValue({} as never);
    await expect(service.delete('plan-1')).resolves.toBeUndefined();
  });
});
