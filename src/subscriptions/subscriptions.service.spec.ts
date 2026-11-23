import { ConflictException, NotFoundException } from '@nestjs/common';
import { SubscriptionRepository } from '@src/@infra/repository/subscriptions/subscription.repository';
import { UserRepository } from '@src/@infra/repository/user/user.repository';
import { SubscriptionsService } from './subscriptions.service';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let repository: jest.Mocked<Pick<SubscriptionRepository, 'findAll' | 'create' | 'update' | 'delete'>>;
  let userRepository: jest.Mocked<Pick<UserRepository, 'countPersonalsBySubscription'>>;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    userRepository = { countPersonalsBySubscription: jest.fn().mockResolvedValue(0) };
    service = new SubscriptionsService(
      repository as unknown as SubscriptionRepository,
      userRepository as unknown as UserRepository,
    );
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

  it('does not delete a subscription plan that is in use', async () => {
    userRepository.countPersonalsBySubscription.mockResolvedValue(2);
    await expect(service.delete('plan-1')).rejects.toThrow(
      new ConflictException('Este plano está associado a um ou mais personals e não pode ser excluído.'),
    );
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
