import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentEntity } from './entity/student.entity';
import { AttendanceEntity } from '../attendance/entity/attendance.entity';

describe('StudentController', () => {
  let studentController: StudentController;
  let studentService: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            getAbsentStudents: jest.fn(),
            getPresentLessThan75: jest.fn(),
            getAnalyticsData: jest.fn(),
            getVacantSeats: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            removeAll: jest.fn(),
          },
        },
      ],
    }).compile();

    studentController = module.get<StudentController>(StudentController);
    studentService = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(studentController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new student', async () => {
      const createStudentDto: CreateStudentDto = {
        username: 'john_doe@mail.com',
        name: 'John Doe',
        phno: '1234567890',
        currentsem: '5',
        department: 'dept1',
        batchID: 'batch1',
      };

      const result: StudentEntity = {
        id: '1',
        username: createStudentDto.username,
        name: createStudentDto.name,
        phno: createStudentDto.phno,
        currentSem: createStudentDto.currentsem,
        department: {
          id: createStudentDto.department,
          name: 'Computer Science',
          created_at: new Date(),
          updated_at: new Date(),
          students: [],
          batchDetails: [],
        },
        batch: {
          id: createStudentDto.batchID,
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

      jest.spyOn(studentService, 'create').mockResolvedValue(result);

      expect(await studentController.create(createStudentDto)).toBe(result);
      expect(studentService.create).toHaveBeenCalledWith(createStudentDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of students', async () => {
      const result: StudentEntity[] = [{ id: 'uuid', username: 'john123', name: 'John Doe', phno: '1234567890', currentSem: '6', department: {} as any, batch: {} as any, attendance: [], created_at: new Date(), updated_at: new Date() }];
      
      jest.spyOn(studentService, 'findAll').mockResolvedValue(result);

      expect(await studentController.findAll()).toBe(result);
    });
  });

  describe('getAbsentStudents', () => {
    it('should return an array of absent students', async () => {
      const result: AttendanceEntity[] = [];

      jest.spyOn(studentService, 'getAbsentStudents').mockResolvedValue(result);

      expect(await studentController.getAbsentStudents({ batchId: 'batch1' }, '2024-01-01')).toBe(result);
    });
  });

  describe('getStudentslessThan75', () => {
    it('should return students with less than 75% attendance', async () => {
      const result = [];

      jest.spyOn(studentService, 'getPresentLessThan75').mockResolvedValue(result);

      expect(await studentController.getStudentslessThan75({ batchId: 'batch1' })).toBe(result);
    });
  });

  describe('getAnalytics', () => {
    it('should return analytics data', async () => {
      const result = [];

      jest.spyOn(studentService, 'getAnalyticsData').mockResolvedValue(result);

      expect(await studentController.getAnalytics()).toBe(result);
    });
  });

  describe('getVacantSeats', () => {
    it('should return vacant seat information', async () => {
      const result : any = {};

      jest.spyOn(studentService, 'getVacantSeats').mockResolvedValue(result);

      expect(await studentController.getVacantSeats({})).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single student', async () => {
      const result: StudentEntity = { id: 'uuid', username: 'john123', name: 'John Doe', phno: '1234567890', currentSem: '6', department: {} as any, batch: {} as any, attendance: [], created_at: new Date(), updated_at: new Date() };

      jest.spyOn(studentService, 'findOne').mockResolvedValue(result);

      expect(await studentController.findOne('uuid')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const updateStudentDto: UpdateStudentDto = { name: 'Updated Name' };
      const result: StudentEntity[] = [];

      jest.spyOn(studentService, 'update').mockResolvedValue(result);

      expect(await studentController.update('uuid', updateStudentDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete a student', async () => {
      const result: StudentEntity[] = [];

      jest.spyOn(studentService, 'remove').mockResolvedValue(result);

      expect(await studentController.remove('uuid')).toBe(result);
    });
  });

  describe('removeAll', () => {
    it('should delete all students', async () => {
      const result = { message: 'All students deleted successfully' };

      jest.spyOn(studentService, 'removeAll').mockResolvedValue(result);

      expect(await studentController.removeAll()).toBe(result);
    });
  });
});
