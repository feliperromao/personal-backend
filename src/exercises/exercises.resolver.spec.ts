import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesResolver } from './exercises.resolver';

describe('ExercisesResolver', () => {
  let resolver: ExercisesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExercisesResolver],
    }).compile();

    resolver = module.get<ExercisesResolver>(ExercisesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
