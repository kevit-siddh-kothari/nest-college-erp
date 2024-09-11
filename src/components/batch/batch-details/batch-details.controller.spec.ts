import { Test, TestingModule } from '@nestjs/testing';
import { BatchDetailsController } from './batch-details.controller';
import { BatchDetailsService } from './batch-details.service';

describe('BatchDetailsController', () => {
  let controller: BatchDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchDetailsController],
      providers: [BatchDetailsService],
    }).compile();

    controller = module.get<BatchDetailsController>(BatchDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
