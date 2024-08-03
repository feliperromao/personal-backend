import { Test, TestingModule } from '@nestjs/testing';
import { TrainingProgressService } from './training-progress.service';
import { TrainingProgress, TrainingProgressSchema } from '@src/@infra/models/training-progress/mongoose/training-progress.model';
import { Model, connect } from 'mongoose';
import TrainingProgressRepository from '@src/@infra/repository/training-progress/training-progress.repository';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import TrainingsRepository from '@src/@infra/repository/trainings/training.repository';
import { Training, TrainingSchema } from '@src/@infra/models/training/mongoose/training.model';
import { FINISH_STATUS } from './enum/finish-status.enum';

let mongod: MongoMemoryServer;
let mongoConnection;

describe('TrainingProgressService', () => {
  let service: TrainingProgressService;
  let repository: TrainingProgressRepository;
  let trainingRepository: TrainingsRepository;
  let model: Model<TrainingProgress>;
  let trainingModel: Model<Training>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    mongoConnection = (await connect(uri, {}));
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: mongod.getUri(),
          }),
        }),
        MongooseModule.forFeature([{ name: TrainingProgress.name, schema: TrainingProgressSchema }]),
        MongooseModule.forFeature([{ name: Training.name, schema: TrainingSchema }]),
      ],
      providers: [TrainingProgressService, TrainingProgressRepository, TrainingsRepository],
    }).compile();

    service = module.get<TrainingProgressService>(TrainingProgressService);
    repository = module.get<TrainingProgressRepository>(TrainingProgressRepository);
    trainingRepository = module.get<TrainingsRepository>(TrainingsRepository);
    model = module.get<Model<TrainingProgress>>(getModelToken('TrainingProgress'));
    trainingModel = module.get<Model<Training>>(getModelToken('Training'));
  });

  afterAll(async () => {
    await mongoConnection.connection.close();
    await mongod.stop();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should throws if training not exists when try start a training", async () => {
    await expect(service.startTraining("123")).rejects.toThrowError("Training not found");
  });

  it("should throws if training not exists when try finish a training", async () => {
    await expect(service.finishTraining("123", FINISH_STATUS.MUITO_INTENSA)).rejects.toThrowError("TrainingProgress not found");
  })

  it("should throws if training not exists when try cancel a training", async () => {
    await expect(service.cancelTraining("123")).rejects.toThrowError("TrainingProgress not found");
  })

  it("should start a training", async () => {
    const trainingData = {
      name: "Test",
      description: "Test description",
      show_to_student: true,
      student_id: "123",
      personal_id: "XXX",
      exercises: [
        {
          id: "1",
          name: "Exercise 1",
          personal_id: "XXX",
          instructions: "Instructions 1",
          video: "video_url",
          rest: 60,
          load: 80,
          load_progress: true,
          series: 3
        }, {
          id: "2",
          name: "Exercise 2",
          personal_id: "XXX",
          instructions: "Instructions 2",
          video: "video_url",
          rest: 60,
          load: 10,
          load_progress: false,
          series: 4
        }]
    }
    const training = await trainingRepository.create(trainingData);
    const trainingProgress = await service.startTraining(training.id);
    expect(trainingProgress).toBeDefined();
    expect(trainingProgress.training_id).toEqual(training.id);
    expect(trainingProgress.exercises.length).toEqual(training.exercises.length);
    expect(trainingProgress.name).toEqual(training.name);
    expect(trainingProgress.description).toEqual(training.description);
    expect(trainingProgress.student_id).toEqual(training.student_id);
    expect(trainingProgress.personal_id).toEqual(training.personal_id);
    expect(trainingProgress.finish_feedback).toBeNull();
    expect(trainingProgress.finish_status).toBeNull();
    expect(trainingProgress.started_at).toBeDefined();
    expect(trainingProgress.finished_at).toBeNull();
  });

  it("should finish training", async () => {
    const trainingData = {
      name: "Test",
      description: "Test description",
      show_to_student: true,
      student_id: "123",
      personal_id: "XXX",
      exercises: [
        {
          id: "1",
          name: "Exercise 1",
          personal_id: "XXX",
          instructions: "Instructions 1",
          video: "video_url",
          rest: 60,
          load: 80,
          load_progress: true,
          series: 3
        }, {
          id: "2",
          name: "Exercise 2",
          personal_id: "XXX",
          instructions: "Instructions 2",
          video: "video_url",
          rest: 60,
          load: 10,
          load_progress: false,
          series: 4
        }]
    }
    const training = await trainingRepository.create(trainingData);
    const trainingProgress = await service.startTraining(training.id);
    const status = FINISH_STATUS.MODERADA;
    const feedback = "Great job!";
    const finished = await service.finishTraining(trainingProgress.id, status, feedback);
    expect(finished).toBeTruthy();

    const trainingFinished = await repository.findById(trainingProgress.id);
    expect(trainingFinished.finish_feedback).toEqual(feedback);
    expect(trainingFinished.finish_status).toEqual(status);
    expect(trainingFinished.finished_at).toBeDefined();
    expect(trainingFinished.name).toEqual(trainingData.name);
  });

  it("should cancel a training", async () => {
    const trainingData = {
      name: "Test",
      description: "Test description",
      show_to_student: true,
      student_id: "123",
      personal_id: "XXX",
      exercises: [
        {
          id: "1",
          name: "Exercise 1",
          personal_id: "XXX",
          instructions: "Instructions 1",
          video: "video_url",
          rest: 60,
          load: 80,
          load_progress: true,
          series: 3
        }, {
          id: "2",
          name: "Exercise 2",
          personal_id: "XXX",
          instructions: "Instructions 2",
          video: "video_url",
          rest: 60,
          load: 10,
          load_progress: false,
          series: 4
        }
      ]
    }
    const training = await trainingRepository.create(trainingData);
    const trainingProgress = await service.startTraining(training.id);
    const canceled = await service.cancelTraining(trainingProgress.id);
    expect(canceled).toBeTruthy();
  })
});
