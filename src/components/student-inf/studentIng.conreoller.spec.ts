import { Test, TestingModule } from '@nestjs/testing';
import { StudentInfRepository } from './student-inf.repositiry';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudentEntity } from '../student/entity/student.entity';
import { Repository } from 'typeorm';
import { CreateStudentInfDto } from './dto/create-student-inf.dto';

describe('StudentInfRepository', () => {
  let repository: StudentInfRepository;
  let studentRepo: Repository<StudentEntity>;

  const mockStudent: StudentEntity = {
    id: '1',
    username: 'john_doe@mail.com',
    name: 'John Doe',
    phno: '1234567890',
    currentSem: '5',
    department: {
      id: 'dept1',
      name: 'Computer Science',
      created_at: new Date(),
      updated_at: new Date(),
      students: [],
      batchDetails: [],
    },
    batch: {
      id: 'batch1',
      year: '2021',
      yearId: [],
      created_at: new Date(),
      updated_at: new Date(),
      students: [],
    },
    attendance: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([mockStudent]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentInfRepository,
        {
          provide: getRepositoryToken(StudentEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
      ],
    }).compile();

    repository = module.get<StudentInfRepository>(StudentInfRepository);
    studentRepo = module.get<Repository<StudentEntity>>(
      getRepositoryToken(StudentEntity),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getStudent', () => {
    it('should return an array of students', async () => {
      const usernameDto: CreateStudentInfDto = {
        username: 'john_doe@mail.com',
      };
      const result = await repository.getStudent(usernameDto);

      expect(result).toEqual([mockStudent]);
      expect(studentRepo.createQueryBuilder).toHaveBeenCalledWith('student');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'student.batch',
        'batch',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'student.department',
        'department',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'student.username = :username',
        { username: 'john_doe@mail.com' },
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });
  });
});
