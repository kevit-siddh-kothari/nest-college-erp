import { Test, TestingModule } from '@nestjs/testing';
import { StudentInfService } from './student-inf.service';

describe('StudentInfService', () => {
  let service: StudentInfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentInfService],
    }).compile();

    service = module.get<StudentInfService>(StudentInfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
