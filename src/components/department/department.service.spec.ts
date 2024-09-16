import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentService } from './department.service';
import { DepartmentRepository } from './department.repository';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentEntity } from './entity/department.entity';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { StudentEntity } from '../student/entity/student.entity';
import { BatchDetailsEntity } from '../batch/entity/batch.details.entity';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let repository: jest.Mocked<DepartmentRepository>;

  const mockDepartmentRepository = {
    createDepartment: jest.fn(),
    getAllDepartments: jest.fn(),
    getDepartmentById: jest.fn(),
    updateDepartment: jest.fn(),
    deleteDepartment: jest.fn(),
    deleteAllDepartment: jest.fn(),
  };

  const mockStudent = {
    id: '1',
    name: 'John Doe',
    department: {} as DepartmentEntity,
  } as StudentEntity;

  const mockBatchDetails = {
    id: '1',
    batch: {
      year: '2033',
    },
    department: {
      id: '1',
      name: 'Computer Science',
    } as DepartmentEntity,
    occupiedSeats: '40',
    availableSeats: '10',
    totalStudentsIntake: '50',
    created_at: new Date(),
    updated_at: new Date(),
  } as BatchDetailsEntity;

  const mockDepartmentEntity: DepartmentEntity = {
    id: '1',
    name: 'Computer Science',
    students: [mockStudent],
    batchDetails: [mockBatchDetails],
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        {
          provide: DepartmentRepository,
          useValue: mockDepartmentRepository,
        },
      ],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
    repository = module.get(DepartmentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a department successfully', async () => {
      const dto: CreateDepartmentDto = { name: 'Computer Science' };

      repository.createDepartment.mockResolvedValue(mockDepartmentEntity);

      const result = await service.create(dto);
      expect(result).toEqual(mockDepartmentEntity);
      expect(repository.createDepartment).toHaveBeenCalledWith(dto);
    });

    it('should throw InternalServerErrorException if repository throws an error', async () => {
      const dto: CreateDepartmentDto = { name: 'Computer Science' };

      repository.createDepartment.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(repository.createDepartment).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of departments', async () => {
      const mockDepartments = [mockDepartmentEntity];

      repository.getAllDepartments.mockResolvedValue(mockDepartments);

      const result = await service.findAll();
      expect(result).toEqual(mockDepartments);
      expect(repository.getAllDepartments).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if repository throws an error', async () => {
      repository.getAllDepartments.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a department by id', async () => {
      repository.getDepartmentById.mockResolvedValue(mockDepartmentEntity);

      const result = await service.findOne('1');
      expect(result).toEqual(mockDepartmentEntity);
      expect(repository.getDepartmentById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if department is not found', async () => {
      repository.getDepartmentById.mockRejectedValue(
        new NotFoundException('Department not found'),
      );

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if repository throws an error', async () => {
      repository.getDepartmentById.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findOne('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a department by id', async () => {
      const dto: UpdateDepartmentDto = { name: 'Updated Computer Science' };
      const mockUpdatedDepartment = [{ id: '1', ...dto } as DepartmentEntity];

      repository.updateDepartment.mockResolvedValue(mockUpdatedDepartment);

      const result = await service.update('1', dto);
      expect(result).toEqual(mockUpdatedDepartment);
      expect(repository.updateDepartment).toHaveBeenCalledWith(dto, '1');
    });

    it('should throw NotFoundException if department is not found', async () => {
      repository.updateDepartment.mockRejectedValue(
        new NotFoundException('Department not found'),
      );

      await expect(
        service.update('1', { name: 'Updated Computer Science' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if repository throws an error', async () => {
      repository.updateDepartment.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.update('1', { name: 'Updated Computer Science' }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should delete a department by id', async () => {
      const mockDepartments = [
        { id: '1', name: 'Computer Science' } as DepartmentEntity,
      ];

      repository.deleteDepartment.mockResolvedValue(mockDepartments);

      const result = await service.remove('1');
      expect(result).toEqual(mockDepartments);
      expect(repository.deleteDepartment).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if department is not found', async () => {
      repository.deleteDepartment.mockRejectedValue(
        new NotFoundException('Department not found'),
      );

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if repository throws an error', async () => {
      repository.deleteDepartment.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.remove('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('removeAllDepartments', () => {
    it('should delete all departments', async () => {
      const mockMessage = { message: 'All departments deleted successfully' };

      repository.deleteAllDepartment.mockResolvedValue(mockMessage);

      const result = await service.removeAllDeparment();
      expect(result).toEqual(mockMessage);
      expect(repository.deleteAllDepartment).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if repository throws an error', async () => {
      repository.deleteAllDepartment.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.removeAllDeparment()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
