import { Test, TestingModule } from '@nestjs/testing';
import { BatchService } from './batch.service';
import { BatchRepository } from './batch.repository';
import { UserRepository } from '../user/user.repository';

describe('BatchService', () => {
  let service: BatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatchService, BatchRepository, UserRepository],
    }).compile();

    service = module.get<BatchService>(BatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
