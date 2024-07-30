import { Test, TestingModule } from '@nestjs/testing';
import { TrainingProgressService } from './training-progress.service';

describe('TrainingProgressService', () => {
  let service: TrainingProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingProgressService],
    }).compile();

    service = module.get<TrainingProgressService>(TrainingProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
