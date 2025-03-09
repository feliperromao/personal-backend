import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesService } from './exercises.service';
import { ExerciseRepository } from '@src/@infra/repository/exercise/exercise.repository';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model, connect } from 'mongoose';
import { Exercise, ExerciseSchema } from '@src/@infra/models/exercise/mongoose/exercise.model';
import { EXERCISE_TYPE } from './enum/exercise.type';

let mongod: MongoMemoryServer;
let mongoConnection;
let model: Model<Exercise>;

describe('ExercisesService', () => {
  let service: ExercisesService;
  let repository: ExerciseRepository;

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
        MongooseModule.forFeature([{ name: Exercise.name, schema: ExerciseSchema }]),
      ],
      providers: [
        ExercisesService,
        ExerciseRepository,
      ],
    }).compile();

    service = module.get<ExercisesService>(ExercisesService);
    repository = module.get<ExerciseRepository>(ExerciseRepository);
    model = module.get<Model<Exercise>>(getModelToken('Exercise'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it("should create new exercise", async() => {
    const exercise = await service.create({ 
      name: "any_name",
      personal_id: "any_personal_id",
      instructions: "any_instructions",
      type: EXERCISE_TYPE.BICEPS,
      video: "any_video",
      rest: 60,
      load: 45,
      load_progress: false,
      series: 3
    });

    expect(exercise.id).toBeDefined();
    expect(exercise.name).toBe("any_name");
    expect(exercise.personal_id).toBe("any_personal_id");
    expect(exercise.instructions).toBe("any_instructions");
    expect(exercise.video).toBe("any_video");
    expect(exercise.rest).toBe(60);
    expect(exercise.load).toBe(45);
    expect(exercise.load_progress).toBe(false);
    expect(exercise.series).toBe(3);
  });

  it("shoud edit an exercise", async () => {
    const exercise = await service.create({
      name: "any_name",
      personal_id: "any_personal_id",
      instructions: "any_instructions",
      type: EXERCISE_TYPE.BICEPS,
      video: "any_video",
      rest: 60,
      load: 45,
      load_progress: false,
      series: 3
    });
    const updatedExercise = await service.update({
      id: exercise.id,
      name: "any_name_updated",
      personal_id: "any_personal_id",
      instructions: "any_instructions",
      type: EXERCISE_TYPE.BICEPS,
      video: "any_video",
      rest: 60,
      load: 45,
      load_progress: false,
      series: 3
    });

    expect(updatedExercise.name).toBe("any_name_updated");
  })

  it("should get all by personal", async () => {
    await service.create({
      name: "any_name",
      personal_id: "personal_id_123456",
      instructions: "any_instructions",
      type: EXERCISE_TYPE.BICEPS,
      video: "any_video",
      rest: 60,
      load: 45,
      load_progress: false,
      series: 3
    });

    await service.create({
      name: "any_name_2",
      personal_id: "personal_id_123456",
      instructions: "any_instructions_2",
      type: EXERCISE_TYPE.BICEPS,
      video: "any_video_2",
      rest: 60,
      load: 45,
      load_progress: false,
      series: 3
    });

    const exercises = await service.getAllByPersonal("personal_id_123456");

    expect(exercises.data.length).toBe(2);
    expect(exercises.data[0].name).toBe("any_name");
    expect(exercises.data[0].personal_id).toBe("personal_id_123456");
  })

  it("should delete all exercises in list", async () => {
    const exercise1 = await service.create({
      name: "any_name",
      personal_id: "XXXXXXXXXXXXXXXXXX",
      instructions: "any_instructions",
      type: EXERCISE_TYPE.BICEPS,
      video: "any_video",
      rest: 60,
      load: 45,
      load_progress: false,
      series: 3
    });

    const exercise2 = await service.create({
      name: "any_name_2",
      personal_id: "XXXXXXXXXXXXXXXXXX",
      instructions: "any_instructions_2",
      type: EXERCISE_TYPE.BICEPS,
      video: "any_video_2",
      rest: 60,
      load: 45,
      load_progress: false,
      series: 3
    });

    await service.delete(exercise1.id)
    await service.delete(exercise2.id)
    const exercises = await service.getAllByPersonal("XXXXXXXXXXXXXXXXXX");
    console.log("🚀 ~ it ~ exercises:", exercises)
    expect(exercises.data.length).toBe(0);
  })
});
