import { Test, TestingModule } from '@nestjs/testing';
import { TrainingProgressResolver } from './training-progress.resolver';
import { TrainingProgressService } from './training-progress.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TrainingProgress, TrainingProgressSchema } from '@src/@infra/models/training-progress/mongoose/training-progress.model';
import { connect, Model } from 'mongoose';
import TrainingProgressRepository from '@src/@infra/repository/training-progress/training-progress.repository';
import TrainingsRepository from '@src/@infra/repository/trainings/training.repository';
import { Training, TrainingSchema } from '@src/@infra/models/training/mongoose/training.model';
import { UsersService } from '@src/users/users.service';
import { UserRepository } from '@src/@infra/repository/user/user.repository';
import { User, UserSchema } from '@src/@infra/models/user/mongoose/user.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import CreateTrainingInput from '@src/trainings/inputs/create-training.input';
import TrainingProgressInput from './inputs/start-training.input';
import { FINISH_STATUS } from './enum/finish-status.enum';
import { NotFoundException } from '@nestjs/common';

let mongod: MongoMemoryServer;
let mongoConnection;
let model: Model<TrainingProgress>;
let trainingModel: Model<Training>;
let userModel: Model<User>

describe('TrainingProgressResolver', () => {
  let resolver: TrainingProgressResolver;
  let service: TrainingProgressService;
  let userService: UsersService;
  let repository: TrainingProgressRepository;
  let trainingsRepository: TrainingsRepository;
  let userRepository: UserRepository;

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
        MongooseModule.forFeature([
          { name: TrainingProgress.name, schema: TrainingProgressSchema },
          { name: Training.name, schema: TrainingSchema },
          { name: User.name, schema: UserSchema },
        ]),
      ],
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        TrainingProgressResolver,
        TrainingProgressService,
        UsersService,
        TrainingProgressRepository,
        TrainingsRepository,
        UserRepository,
      ],
    }).compile();

    resolver = module.get<TrainingProgressResolver>(TrainingProgressResolver);
    service = module.get<TrainingProgressService>(TrainingProgressService);
    userService = module.get<UsersService>(UsersService);
    repository = module.get<TrainingProgressRepository>(TrainingProgressRepository);
    trainingsRepository = module.get<TrainingsRepository>(TrainingsRepository);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await mongoConnection.connection.dropDatabase();
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it("should throws if trainig not exists when try start a training", async () => {
    await expect(async () => {
      await resolver.startTraining({
        id: "any_training_id"
      } as TrainingProgressInput)
    }).rejects.toThrow(new NotFoundException(`Training not found (id: any_training_id)`))
  })

  it("should start an exist training", async() => {
    const trainingData = {
      name: "Costas + abdominal",
      personal_id: "any_personal_id",
      show_to_student: true,
      student_id: "any_student_id",
      description: "Segunda - Costas",
      exercises: [
        {
          id: "1",
          name: "Puxada alta",
          instructions: "4x12",
          load: 0,
          load_progress: true,
          personal_id: "any_personal_id",
          rest: 90,
          series: 4,
          video: "https://www.youtube.com/shorts/yp14vDyCUJA",
        },
        {
          id: "2",
          name: "Remada curvada",
          instructions: "4x12",
          load: 0,
          load_progress: true,
          personal_id: "any_personal_id",
          rest: 60,
          series: 4,
          video: "https://www.youtube.com/shorts/7lc8Ow4vIwA",
        },
        {
          id: "2",
          name: "Remada unilateral",
          instructions: "4x12",
          load: 0,
          load_progress: true,
          personal_id: "any_personal_id",
          rest: 45,
          series: 4,
          video: "https://www.youtube.com/shorts/L2FuijYFTvE",
        },
      ]
    } as CreateTrainingInput
    const training = await trainingsRepository.create(trainingData)
    const startedTraining = await resolver.startTraining({
      id: training._id.toString(),
    } as TrainingProgressInput)

    expect(startedTraining.training_id).toBe(training._id.toString())
  });

  it("should finish a training", async() => {
    const trainingData = {
      name: "Costas + abdominal",
      personal_id: "any_personal_id",
      show_to_student: true,
      student_id: "any_student_id",
      description: "Segunda - Costas",
      exercises: [
        {
          id: "1",
          name: "Puxada alta",
          instructions: "4x12",
          load: 0,
          load_progress: true,
          personal_id: "any_personal_id",
          rest: 90,
          series: 4,
          video: "https://www.youtube.com/shorts/yp14vDyCUJA",
        },
        {
          id: "2",
          name: "Remada curvada",
          instructions: "4x12",
          load: 0,
          load_progress: true,
          personal_id: "any_personal_id",
          rest: 60,
          series: 4,
          video: "https://www.youtube.com/shorts/7lc8Ow4vIwA",
        },
        {
          id: "2",
          name: "Remada unilateral",
          instructions: "4x12",
          load: 0,
          load_progress: true,
          personal_id: "any_personal_id",
          rest: 45,
          series: 4,
          video: "https://www.youtube.com/shorts/L2FuijYFTvE",
        },
      ]
    } as CreateTrainingInput
    const training = await trainingsRepository.create(trainingData)
    const startedTraining = await resolver.startTraining({
      id: training._id.toString(),
    } as TrainingProgressInput)
    const finished = await resolver.finishTraining({id: startedTraining.id, status: FINISH_STATUS.INTENSA, feedback: "treino top"} as TrainingProgressInput)
    expect(finished.finish_status).toBe(FINISH_STATUS.INTENSA)
    expect(finished.finish_feedback).toBe("treino top")
    expect(finished.training_id).toBe(training._id.toString())
  });

  it("should throws if trainig not exists when try finish a training", async () => {
    await expect(async () => {
      await resolver.finishTraining({
        id: "any_training_id",
        status: FINISH_STATUS.INTENSA,
        feedback: "mais um treino top finalizado"
      } as TrainingProgressInput)
    }).rejects.toThrow(new NotFoundException(`TrainingProgress not found (id: any_training_id)`))
  })

  it("should cancel a training", async() => {
    const trainingData = {
      name: "Costas + abdominal",
      personal_id: "any_personal_id",
      show_to_student: true,
      student_id: "any_student_id",
      description: "Segunda - Costas",
      exercises: [
        {
          id: "1",
          name: "Puxada alta",
          instructions: "4x12",
          load: 0,
          load_progress: true,
          personal_id: "any_personal_id",
          rest: 90,
          series: 4,
          video: "https://www.youtube.com/shorts/yp14vDyCUJA",
        },
        {
          id: "2",
          name: "Remada curvada",
          instructions: "4x12",
          load: 0,
          load_progress: true,
          personal_id: "any_personal_id",
          rest: 60,
          series: 4,
          video: "https://www.youtube.com/shorts/7lc8Ow4vIwA",
        },
        {
          id: "2",
          name: "Remada unilateral",
          instructions: "4x12",
          load: 0,
          load_progress: true,
          personal_id: "any_personal_id",
          rest: 45,
          series: 4,
          video: "https://www.youtube.com/shorts/L2FuijYFTvE",
        },
      ]
    } as CreateTrainingInput
    const training = await trainingsRepository.create(trainingData)
    const startedTraining = await resolver.startTraining({
      id: training._id.toString(),
    } as TrainingProgressInput)
    const finished = await resolver.cancelTraining({id: startedTraining.id} as TrainingProgressInput)
    expect(finished).toBeTruthy()
  });

  it("should throws if trainig not exists when try cancel training", async () => {
    await expect(async () => {
      await resolver.cancelTraining({
        id: "any_training_id"
      } as TrainingProgressInput)
    }).rejects.toThrow(new NotFoundException(`TrainingProgress not found (id: any_training_id)`))
  })
});
