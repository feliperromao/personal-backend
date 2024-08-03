import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User, UserSchema } from '@src/@infra/models/user/mongoose/user.model';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model, connect } from 'mongoose';
import { UserRepository } from '@src/@infra/repository/user/user.repository';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { CreatePersonalInput } from './inputs/create-personal.input';
import { CreateStudentInput } from './inputs/create-student.input';
import { BadRequestException } from '@nestjs/common';
import { USER_TYPE } from './enum/user.type';

let mongod: MongoMemoryServer;
let mongoConnection;
let model: Model<User>;


describe('UsersService', () => {
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

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should return all users", async () => {
    await service.createPersonal(personlData());
    await service.createStudent(studentData());
    const users = await service.findAll();
    expect(users.length).toBe(2);
  });

  it.skip("should throws if user already exists", async () => {
    expect(async () => {
      await service.createPersonal(personlData());
      return await service.createPersonal(personlData());
    }).toThrowError(BadRequestException)
  });

  it("should get all users by personal", async () => {
    await service.createStudent({
      email: "student_1@mail.com",
      name: "student_1",
      password: "XXXXXXXXX",
      personal_id: "personal_123"
    });
    await service.createStudent({
      email: "student_2@mail.com",
      name: "student_2",
      password: "XXXXXXXXX",
      personal_id: "personal_123"
    });
    await service.createStudent({
      email: "student_3@mail.com",
      name: "student_3",
      password: "XXXXXXXXX",
      personal_id: "personal_456"
    });
    
    const users = await service.getAllByPersonal("personal_123");
    expect(users.length).toBe(2);

    const users_2 = await service.getAllByPersonal("personal_456");
    expect(users_2.length).toBe(1);
  });

  it("should find user by id", async () => {
    const user = await service.createPersonal({
      name: 'any_personal',
      email: 'personal_example@example.com',
      password: 'XXXXXXXX',
    });
    const userFound = await service.findById(user.id);
    expect(userFound.id).toBe(user.id);
    expect(userFound.type).toBe(USER_TYPE.PERSONAL);
  })

  it("should find user by email", async () => {
    const userFound = await service.findByEmail("student@example.com");
    expect(userFound.email).toBe("student@example.com");
    expect(userFound.type).toBe(USER_TYPE.STUDENT);
  })

  it("should update student", async () => {
    const data = {
      name: 'student_new',
      email: 'student_new@example.com',
      password: 'XXXXXXXX',
      personal_id: 'XXXXXXXXX'
    }
    const user = await service.createStudent(data);
    user.name = "new_name";
    user.email = "new_email@mail.com";
    const userUpdated = await service.updateStudents(user);
    expect(userUpdated.name).toBe("new_name");
    expect(userUpdated.email).toBe("new_email@mail.com");
    expect(userUpdated.type).toBe(USER_TYPE.STUDENT);
  })

  it("should delete user", async () => {
    const user = await service.createStudent({
      email: "felipe@mail.com",
      name: "felipe",
      password: "XXXXXXXX",
      personal_id: "XXXXXXXXX"
    });
    await service.deleteStudents([user.id]);
    const userDeleted = await service.findByEmail(user.email);
    expect(userDeleted).toBeNull();
  })
});


const personlData = (): CreatePersonalInput => {
  return {
    name: 'personal',
    email: 'personal@example.com',
    password: 'XXXXXXXX',
  };
}

const studentData = (): CreateStudentInput => {
  return {
    name: 'student',
    email: 'student@example.com',
    password: 'XXXXXXXX',
    personal_id: 'XXXXXXXXX'
  };
}