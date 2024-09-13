import { Test, TestingModule } from '@nestjs/testing';
import { BatchDetailsService } from './batch-details.service';
import { BatchDetailsRepository } from './batch-details.repository';
import { UserRepository } from 'src/components/user/user.repository';

describe('BatchDetailsService', () => {
  let service: BatchDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatchDetailsService, BatchDetailsRepository, UserRepository],
    }).compile();

    service = module.get<BatchDetailsService>(BatchDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
