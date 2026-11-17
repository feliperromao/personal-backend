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
import { EXERCISE_TYPE } from '@src/exercises/enum/exercise.type';

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
    await expect(service.startTraining("6719412f0024cd0c7a0bb59c")).rejects.toThrowError("Training not found");
  });

  it("should throws if training not exists when try finish a training", async () => {
    await expect(service.finishTraining("6719412f0024cd0c7a0bb59c", FINISH_STATUS.MUITO_INTENSA)).rejects.toThrowError("TrainingProgress not found");
  })

  it("should throws if training not exists when try cancel a training", async () => {
    await expect(service.cancelTraining("6719412f0024cd0c7a0bb59c")).rejects.toThrowError("TrainingProgress not found");
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
          type: EXERCISE_TYPE.BACK,
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
          type: EXERCISE_TYPE.BACK,
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
    expect(trainingProgress.completed_series).toEqual([]);
  });

  it("should persist the load used in each completed series without duplicates", async () => {
    const training = await trainingRepository.create({
      name: "Load progression",
      description: "Track each series",
      show_to_student: true,
      student_id: "student-123",
      personal_id: "personal-123",
      exercises: [{
        id: "exercise-1",
        name: "Bench press",
        personal_id: "personal-123",
        instructions: "Control the movement",
        type: EXERCISE_TYPE.CHEST,
        video: "",
        rest: 60,
        load: 80,
        load_progress: true,
        series: 3
      }]
    });
    const progress = await service.startTraining(training.id);

    const firstRecord = await service.completeSeries(progress.id, "student-123", "exercise-1", 1, 82.5);
    expect(firstRecord.completed_series).toHaveLength(1);
    expect(firstRecord.completed_series[0]).toMatchObject({
      exercise_id: "exercise-1",
      series: 1,
      load: 82.5
    });
    expect(firstRecord.completed_series[0].completed_at).toBeDefined();

    const correctedRecord = await service.completeSeries(progress.id, "student-123", "exercise-1", 1, 85);
    expect(correctedRecord.completed_series).toHaveLength(1);
    expect(correctedRecord.completed_series[0].load).toBe(85);

    const secondRecord = await service.completeSeries(progress.id, "student-123", "exercise-1", 2, 87.5);
    expect(secondRecord.completed_series).toHaveLength(2);
    expect(secondRecord.completed_series[1]).toMatchObject({ series: 2, load: 87.5 });
  });

  it("should reject series outside the exercise range or belonging to another student", async () => {
    const training = await trainingRepository.create({
      name: "Protected progress",
      description: "Validation",
      show_to_student: true,
      student_id: "student-owner",
      personal_id: "personal-123",
      exercises: [{
        id: "exercise-1",
        name: "Squat",
        personal_id: "personal-123",
        instructions: "Keep control",
        type: EXERCISE_TYPE.LEGS,
        video: "",
        rest: 60,
        load: 40,
        load_progress: true,
        series: 3
      }]
    });
    const progress = await service.startTraining(training.id);

    await expect(service.completeSeries(progress.id, "another-student", "exercise-1", 1, 40))
      .rejects.toThrowError("Active TrainingProgress not found");
    await expect(service.completeSeries(progress.id, "student-owner", "exercise-1", 4, 40))
      .rejects.toThrowError("Series must be between 1 and 3");
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
          type: EXERCISE_TYPE.BACK,
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
          type: EXERCISE_TYPE.BACK,
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
          type: EXERCISE_TYPE.BACK,
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
          type: EXERCISE_TYPE.BACK,
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
