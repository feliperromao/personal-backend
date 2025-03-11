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
import { UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import Bcrypt from '@src/@infra/encrypt/bcrypt';
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
});
