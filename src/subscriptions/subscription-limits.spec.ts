import { BadRequestException } from '@nestjs/common';
import { ExerciseRepository } from '@src/@infra/repository/exercise/exercise.repository';
import { SubscriptionRepository } from '@src/@infra/repository/subscriptions/subscription.repository';
import TrainingsRepository from '@src/@infra/repository/trainings/training.repository';
import { UserRepository } from '@src/@infra/repository/user/user.repository';
import { ExercisesService } from '@src/exercises/exercises.service';
import { EXERCISE_TYPE } from '@src/exercises/enum/exercise.type';
import { TrainingsService } from '@src/trainings/trainings.service';
import { UsersService } from '@src/users/users.service';

const plan = {
  id: '507f1f77bcf86cd799439011',
  name: 'Essencial',
  max_students: 2,
  max_exercises: 3,
  max_training: 1,
  price_brl: 49.9,
};

describe('Subscription resource limits', () => {
  it('blocks student creation when the subscription limit is reached', async () => {
    const userRepository = {
      countStudents: jest.fn().mockResolvedValue(2),
      findById: jest.fn().mockResolvedValue({
        _id: { toString: () => 'personal-1' },
        name: 'Personal', email: 'personal@example.com', password: 'hash', phone: '85999999999',
        blocked: false, type: 'PERSONAL', subscription_id: plan.id,
      }),
    };
    const subscriptionRepository = {
      findById: jest.fn().mockResolvedValue({ ...plan, _id: { toString: () => plan.id } }),
    };
    const service = new UsersService(
      userRepository as unknown as UserRepository,
      subscriptionRepository as unknown as SubscriptionRepository,
    );

    await expect(service.createStudent({
      name: 'Aluno Teste', email: 'aluno@example.com', password: 'password', confirm_password: 'password',
      phone: '85999999999', personal_id: 'personal-1', birthdate: '2000-01-01',
      weight: 70, height: 175, monthly_value_brl: 100, blocked: false,
    })).rejects.toThrow(new BadRequestException('Limite de 2 alunos do plano Essencial atingido.'));
  });

  it('blocks exercise creation when the subscription limit is reached', async () => {
    const repository = {
      countByPersonal: jest.fn().mockResolvedValue(3),
      create: jest.fn(),
    };
    const usersService = { getSubscriptionLimits: jest.fn().mockResolvedValue(plan) };
    const service = new ExercisesService(
      repository as unknown as ExerciseRepository,
      usersService as unknown as UsersService,
    );

    await expect(service.create({
      name: 'Supino', personal_id: 'personal-1', type: EXERCISE_TYPE.CHEST, rest: 60, series: 3,
    })).rejects.toThrow(new BadRequestException('Limite de 3 exercícios do plano Essencial atingido.'));
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('blocks training creation when the subscription limit is reached', async () => {
    const repository = {
      countByPersonal: jest.fn().mockResolvedValue(1),
      create: jest.fn(),
    };
    const usersService = { getSubscriptionLimits: jest.fn().mockResolvedValue(plan) };
    const service = new TrainingsService(
      repository as unknown as TrainingsRepository,
      usersService as unknown as UsersService,
    );

    await expect(service.create({
      name: 'Treino A', personal_id: 'personal-1', show_to_student: false, exercises: [],
    })).rejects.toThrow(new BadRequestException('Limite de 1 treino do plano Essencial atingido.'));
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('requires a valid subscription when creating a personal', async () => {
    const userRepository = {};
    const subscriptionRepository = { findById: jest.fn().mockResolvedValue(null) };
    const service = new UsersService(
      userRepository as unknown as UserRepository,
      subscriptionRepository as unknown as SubscriptionRepository,
    );

    await expect(service.createPersonal({
      name: 'Personal Teste', email: 'personal@example.com', password: 'password',
      phone: '85999999999', subscription_id: plan.id,
    })).rejects.toThrow(new BadRequestException('Plano de assinatura inválido.'));
  });
});
