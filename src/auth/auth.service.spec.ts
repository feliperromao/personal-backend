import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@src/users/users.service';
import { UserRepository } from '@src/@infra/repository/user/user.repository';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model, connect } from 'mongoose';
import { User, UserSchema } from '@src/@infra/models/user/mongoose/user.model';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import Bcrypt from '@src/@infra/encrypt/bcrypt';
import { SubscriptionRepository } from '@src/@infra/repository/subscriptions/subscription.repository';

jest.mock('@nestjs/jwt', () => ({
  JwtService: class JwtService {},
}));
dotenv.config();

let mongod: MongoMemoryServer;
let mongoConnection;
let model: Model<User>;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let repository: UserRepository;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
  
    mongoConnection = (await connect(uri, {}));
  });

  afterAll(async() => {
    await mongoConnection.connection.close();
    await mongod.stop();
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: mongod.getUri(),
          }),
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        CacheModule.register(),
      ],
      providers: [
        AuthService,
        UsersService,
        UserRepository,
        {
          provide: SubscriptionRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue({
              _id: { toString: () => '507f1f77bcf86cd799439011' },
              name: 'Teste', max_students: 100, max_exercises: 100,
              max_training: 100, price_brl: 49.9,
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => "ANY_BEARER_TOKEN",
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jest.spyOn(usersService, 'getSubscriptionLimits').mockResolvedValue({
      id: '507f1f77bcf86cd799439011',
      name: 'Teste', max_students: 100, max_exercises: 100,
      max_training: 100, price_brl: 49.9,
    });
    repository = module.get<UserRepository>(UserRepository);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should throws if user not found", async () => {
    expect(async () => await service.login("student_1@mail.com", "password")).rejects.toThrow(
      new UnauthorizedException("invalid credentials")
    );
  })

  it("should return token if user found and credentials is valid", async () => {
    await usersService.createStudent({
      email: "student_1@mail.com",
      name: "student_1",
      password: "XXXXXXXXX",
      personal_id: "personal_123",
      birthdate: "2024-01-01",
      blocked: false,
      confirm_password: "XXXXXXXXX",
      height: 190,
      weight: 60,
      phone: "55859999999",
      monthly_value_brl: 85
    });

    const validated = await service.login("student_1@mail.com", "XXXXXXXXX")
    expect(validated).toBeDefined();
  })

  it("should throws if credentials is invalid", async () => {
    expect(async () => await service.login("student_1@mail.com", "wronk_password")).rejects.toThrow(
      new UnauthorizedException("invalid credentials")
    );
  })

  it('permite ao usuário autenticado redefinir a própria senha', async () => {
    const user = await usersService.createStudent({
      email: 'reset.student@mail.com',
      name: 'Reset Student',
      password: 'old-password',
      personal_id: 'personal_123',
      birthdate: '2024-01-01',
      blocked: false,
      confirm_password: 'old-password',
      height: 190,
      weight: 60,
      phone: '55859999999',
      monthly_value_brl: 85,
    });

    await expect(service.changePassword(user.id, 'old-password', 'new-password', 'new-password'))
      .resolves.toEqual({ message: 'Senha redefinida com sucesso.' });
    await expect(service.login('reset.student@mail.com', 'old-password'))
      .rejects.toThrow(UnauthorizedException);
    await expect(service.login('reset.student@mail.com', 'new-password'))
      .resolves.toBeDefined();
  });

  it('rejeita senhas curtas', async () => {
    await expect(service.changePassword('user-id', 'current-password', 'curta', 'curta'))
      .rejects.toThrow(new BadRequestException('A nova senha deve ter pelo menos 8 caracteres.'));
  });

  it('rejeita confirmação de senha diferente', async () => {
    await expect(service.changePassword('user-id', 'current-password', 'new-password', 'outra-senha'))
      .rejects.toThrow(new BadRequestException('As senhas não coincidem.'));
  });

  it('rejeita a troca quando a senha atual está incorreta', async () => {
    const user = await usersService.createStudent({
      email: 'wrong-current-password@mail.com',
      name: 'Wrong Password Student',
      password: 'current-password',
      personal_id: 'personal_123',
      birthdate: '2024-01-01',
      blocked: false,
      confirm_password: 'current-password',
      height: 190,
      weight: 60,
      phone: '55859999999',
      monthly_value_brl: 85,
    });

    await expect(service.changePassword(user.id, 'wrong-password', 'new-password', 'new-password'))
      .rejects.toThrow(new BadRequestException('A senha atual está incorreta.'));
  });
});
