import { Test, TestingModule } from '@nestjs/testing';
import { TrainingsService } from './trainings.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model, connect } from 'mongoose';
import { Training, TrainingSchema } from '@src/@infra/models/training/mongoose/training.model';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import TrainingsRepository from '@src/@infra/repository/trainings/training.repository';
import CreateTrainingInput from './inputs/create-training.input';

let mongod: MongoMemoryServer;
let mongoConnection;

describe('TrainingsService', () => {
  let service: TrainingsService;
  let repository: TrainingsRepository;
  let model: Model<Training>;

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
        MongooseModule.forFeature([{ name: Training.name, schema: TrainingSchema }]),
      ],
      providers: [TrainingsService,TrainingsRepository],
    }).compile();

    service = module.get<TrainingsService>(TrainingsService);
    repository = module.get<TrainingsRepository>(TrainingsRepository);
    model = module.get<Model<Training>>(getModelToken('Training'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should create a training", async () => {
    const training = await service.create(getTrainingData());

    expect(training).toBeDefined();
    expect(training.id).toBeDefined();
    expect(training.name).toBe("Test");
    expect(training.description).toBe("Test description");
    expect(training.show_to_student).toBe(true);
    expect(training.student_id).toBe("123");
    expect(training.personal_id).toBe("XXX");
    expect(training.exercises).toHaveLength(2);
  });

  it("should update a training", async () => {
    const training = await service.create(getTrainingData());
    const updated = await service.update({
      id: training.id,
      name: "Test updated",
      description: "Test description updated",
      show_to_student: false,
      student_id: "XXX",
      personal_id: "XXX",
      exercises: []
    });

    expect(updated).toBeDefined();
    expect(updated.id).toBe(training.id);
    expect(updated.name).toBe("Test updated");
    expect(updated.description).toBe("Test description updated");
  });

  it("should delete a training", async () => {
    const training = await service.create(getTrainingData());
    const deleted = await service.delete([training.id]);

    expect(deleted).toBe(true);
  })

  it("should get all by personal", async () => {
    const data = getTrainingData();
    data.personal_id = "123ABC";
    await service.create(data);
    data.personal_id = "456ABC"
    await service.create(data);
    await service.create(data);

    const trainings01 = await service.getAllByPersonal("123ABC");
    expect(trainings01).toHaveLength(1);

    const trainings02 = await service.getAllByPersonal("456ABC");
    expect(trainings02).toHaveLength(2);
  })

  it("should get all by student", async () => {
    const data = getTrainingData();
    data.student_id = "STUDENT_XXX";
    await service.create(data);
    data.student_id = "STUDENT_YYY"
    await service.create(data);
    await service.create(data);

    const trainings01 = await service.getAllByStudent("STUDENT_XXX");
    expect(trainings01).toHaveLength(1);

    const trainings02 = await service.getAllByStudent("STUDENT_YYY");
    expect(trainings02).toHaveLength(2);
  })
});


const getTrainingData = (): CreateTrainingInput => {
  const exercise_1 = {
    id: "1",
    name: "Exercise 1",
    personal_id: "XXX",
    instructions: "Instructions 1",
    video: "video_url",
    rest: 60,
    load: 80,
    load_progress: true,
    series: 3
  };
  const exercise_2 = {
    id: "2",
    name: "Exercise 2",
    personal_id: "XXX",
    instructions: "Instructions 2",
    video: "video_url",
    rest: 60,
    load: 10,
    load_progress: false,
    series: 4
  };

  return {
    name: "Test",
    description: "Test description",
    show_to_student: true,
    student_id: "123",
    personal_id: "XXX",
    exercises: [exercise_1, exercise_2]
  } as CreateTrainingInput
}