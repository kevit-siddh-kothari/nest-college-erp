import { Test, TestingModule } from '@nestjs/testing';
import { StudentInfController } from './student-inf.controller';
import { StudentInfService } from './student-inf.service';

describe('StudentInfController', () => {
  let controller: StudentInfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentInfController],
      providers: [StudentInfService],
    }).compile();

    controller = module.get<StudentInfController>(StudentInfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
