import { Test, TestingModule } from '@nestjs/testing';
import { TrainingProgressResolver } from './training-progress.resolver';

describe('TrainingProgressResolver', () => {
  let resolver: TrainingProgressResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingProgressResolver],
    }).compile();

    resolver = module.get<TrainingProgressResolver>(TrainingProgressResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
