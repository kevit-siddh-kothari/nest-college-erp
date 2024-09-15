import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { StudentRepository } from './student.repository';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentEntity } from './entity/student.entity';

describe('StudentService', () => {
  let studentService: StudentService;
  let studentRepository: StudentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: StudentRepository,
          useValue: {
            getDepartmentById: jest.fn(),
            getBatchEntityById: jest.fn(),
            createStudent: jest.fn(),
            getAllStudents: jest.fn(),
            getStudentById: jest.fn(),
            updateStudent: jest.fn(),
            deleteStudent: jest.fn(),
            deleteAllStudent: jest.fn(),
            getAnalyticsData: jest.fn(),
            findBatchData: jest.fn(),
            countStudentsByBatch: jest.fn(),
            findAttendanceData: jest.fn(),
            findPresentLessThan75: jest.fn(),
          },
        },
      ],
    }).compile();

    studentService = module.get<StudentService>(StudentService);
    studentRepository = module.get<StudentRepository>(StudentRepository);
  });

  it('should be defined', () => {
    expect(studentService).toBeDefined();
  });

  describe('create', () => {
    it('should create a student successfully', async () => {
      const createStudentDto: CreateStudentDto = {
        department: 'dept1',
        batchID: 'batch1',
      } as any;
      const departmentEntity = { id: 'dept1' } as any;
      const batchEntity = { id: 'batch1' } as any;
      const studentEntity = { id: 'student1' } as StudentEntity;

      jest
        .spyOn(studentRepository, 'getDepartmentById')
        .mockResolvedValue(departmentEntity);
      jest
        .spyOn(studentRepository, 'getBatchEntityById')
        .mockResolvedValue(batchEntity);
      jest
        .spyOn(studentRepository, 'createStudent')
        .mockResolvedValue(studentEntity);

      const result = await studentService.create(createStudentDto);
      expect(result).toBe(studentEntity);
    });

    it('should throw NotFoundException if department does not exist', async () => {
      const createStudentDto: CreateStudentDto = {
        department: 'invalid_dept',
      } as any;

      jest
        .spyOn(studentRepository, 'getDepartmentById')
        .mockResolvedValue(null);

      await expect(studentService.create(createStudentDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if batch does not exist', async () => {
      const createStudentDto: CreateStudentDto = {
        department: 'dept1',
        batchID: 'invalid_batch',
      } as any;
      const departmentEntity = { id: 'dept1' } as any;

      jest
        .spyOn(studentRepository, 'getDepartmentById')
        .mockResolvedValue(departmentEntity);
      jest
        .spyOn(studentRepository, 'getBatchEntityById')
        .mockResolvedValue(null);

      await expect(studentService.create(createStudentDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      const createStudentDto: CreateStudentDto = {
        department: 'dept1',
        batchID: 'batch1',
      } as any;

      jest
        .spyOn(studentRepository, 'getDepartmentById')
        .mockRejectedValue(new Error('Something went wrong'));

      await expect(studentService.create(createStudentDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all students', async () => {
      const students: StudentEntity[] = [{ id: 'student1' }] as StudentEntity[];
      jest
        .spyOn(studentRepository, 'getAllStudents')
        .mockResolvedValue(students);

      const result = await studentService.findAll();
      expect(result).toBe(students);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(studentRepository, 'getAllStudents')
        .mockRejectedValue(new Error('Something went wrong'));

      await expect(studentService.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a single student', async () => {
      const student = { id: 'student1' } as StudentEntity;
      jest
        .spyOn(studentRepository, 'getStudentById')
        .mockResolvedValue(student);

      const result = await studentService.findOne('student1');
      expect(result).toBe(student);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(studentRepository, 'getStudentById')
        .mockRejectedValue(new Error('Something went wrong'));

      await expect(studentService.findOne('student1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const updateStudentDto: UpdateStudentDto = { name: 'Updated Name' };
      const updatedStudents: StudentEntity[] = [
        { id: 'student1', name: 'Updated Name' },
      ] as StudentEntity[];

      jest
        .spyOn(studentRepository, 'updateStudent')
        .mockResolvedValue(updatedStudents);

      const result = await studentService.update('student1', updateStudentDto);
      expect(result).toBe(updatedStudents);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(studentRepository, 'updateStudent')
        .mockRejectedValue(new Error('Something went wrong'));

      await expect(
        studentService.update('student1', {} as UpdateStudentDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should remove a student', async () => {
      const deletedStudents: StudentEntity[] = [
        { id: 'student1' },
      ] as StudentEntity[];

      jest
        .spyOn(studentRepository, 'deleteStudent')
        .mockResolvedValue(deletedStudents);

      const result = await studentService.remove('student1');
      expect(result).toBe(deletedStudents);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(studentRepository, 'deleteStudent')
        .mockRejectedValue(new Error('Something went wrong'));

      await expect(studentService.remove('student1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('removeAll', () => {
    it('should remove all students', async () => {
      const result = { message: 'All students deleted successfully' };
      jest
        .spyOn(studentRepository, 'deleteAllStudent')
        .mockResolvedValue(result);

      expect(await studentService.removeAll()).toBe(result);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(studentRepository, 'deleteAllStudent')
        .mockRejectedValue(new Error('Something went wrong'));

      await expect(studentService.removeAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getAnalyticsData', () => {
    it('should return analytics data', async () => {
      const analyticsData = [{ data: 'analytics' }];
      jest
        .spyOn(studentRepository, 'getAnalyticsData')
        .mockResolvedValue(analyticsData);

      const result = await studentService.getAnalyticsData();
      expect(result).toBe(analyticsData);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest
        .spyOn(studentRepository, 'getAnalyticsData')
        .mockRejectedValue(new Error('Something went wrong'));

      await expect(studentService.getAnalyticsData()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  it('should throw NotFoundException if batch data is empty', async () => {
    jest.spyOn(studentRepository, 'findBatchData').mockResolvedValue([]);

    await expect(studentService.getVacantSeats({})).rejects.toThrow(
      NotFoundException,
    );
  });
});
