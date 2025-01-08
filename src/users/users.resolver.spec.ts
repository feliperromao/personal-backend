import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../@infra/models/user/mongoose/user.model';
import { Model, connect } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserRepository } from '@src/@infra/repository/user/user.repository';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import GetUsersInput from './inputs/get-users.input';
import { ObjectId } from 'mongodb';
import { USER_TYPE } from './enum/user.type';

let mongod: MongoMemoryServer;
let mongoConnection;
let model: Model<User>;

const student_01 = {
  _id: new ObjectId(),
  name: 'Student_1',
  email: 'student_1@mail.com',
  password: '123456',
  personal_id: 'personal_01',
  type: USER_TYPE.STUDENT
}

const student_02 = {
  _id: new ObjectId(),
  name: 'Student_2',
  email: 'student_2@mail.com',
  password: '123456',
  personal_id: 'personal_01',
  type: USER_TYPE.STUDENT
}
const student_03 = {
  _id: new ObjectId(),
  name: 'Student_3',
  email: 'student_3@mail.com',
  password: '123456',
  personal_id: 'personal_02',
  type: USER_TYPE.STUDENT
}

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;
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
        UsersResolver,
        UsersService,
        UserRepository,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  afterEach(async () => {
    await mongoConnection.connection.dropDatabase();
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('listStudents', () => {
    it('should list users from personal', async () => {
      await service.createStudent(student_01);
      await service.createStudent(student_02);
      await service.createStudent(student_03);
      const args = {
        personal_id: 'personal_01'
      } as GetUsersInput
      const users = await resolver.listStudents(args)
      expect(users.data.length).toEqual(2);
    });
  });
});
