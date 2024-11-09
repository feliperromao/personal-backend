import { Test, TestingModule } from '@nestjs/testing';
import { TrainingProgressController } from './training-progress.controller';

describe('TrainingProgressController', () => {
  let controller: TrainingProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingProgressController],
    }).compile();

    controller = module.get<TrainingProgressController>(TrainingProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
