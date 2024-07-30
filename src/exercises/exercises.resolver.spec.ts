import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesResolver } from './exercises.resolver';
import { ExercisesService } from './exercises.service';
import { ExerciseRepository } from '@src/@infra/repository/exercise/exercise.repository';

describe('ExercisesResolver', () => {
  let resolver: ExercisesResolver;
  let service: ExercisesService;
  let repositorry: ExerciseRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExercisesResolver,
        ExercisesService,
        ExerciseRepository,
      ],
    }).compile();

    resolver = module.get<ExercisesResolver>(ExercisesResolver);
    service = module.get<ExercisesService>(ExercisesService);
    repositorry = module.get<ExerciseRepository>(ExerciseRepository);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
