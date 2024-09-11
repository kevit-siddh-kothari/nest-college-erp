import { Test, TestingModule } from '@nestjs/testing';
import { BatchDetailsService } from './batch-details.service';

describe('BatchDetailsService', () => {
  let service: BatchDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatchDetailsService],
    }).compile();

    service = module.get<BatchDetailsService>(BatchDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
