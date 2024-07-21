import { Test, TestingModule } from '@nestjs/testing';
import { TrainingsResolver } from './trainings.resolver';

describe('TrainingsResolver', () => {
  let resolver: TrainingsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingsResolver],
    }).compile();

    resolver = module.get<TrainingsResolver>(TrainingsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
