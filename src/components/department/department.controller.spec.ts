import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

describe('DepartmentController', () => {
  let departmentController: DepartmentController;
  let departmentService: DepartmentService;

  const mockDepartmentService = {
    create: jest.fn().mockImplementation((dto: CreateDepartmentDto) => {
      return Promise.resolve({ id: '1', ...dto });
    }),
    findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'IT' }]),
    findOne: jest.fn().mockImplementation((id: string) => {
      return Promise.resolve({ id, name: 'IT' });
    }),
    update: jest
      .fn()
      .mockImplementation((id: string, dto: UpdateDepartmentDto) => {
        return Promise.resolve([{ id, ...dto }]);
      }),
    remove: jest.fn().mockResolvedValue([{ id: '1', name: 'IT' }]),
    removeAllDeparment: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentController],
      providers: [
        {
          provide: DepartmentService,
          useValue: mockDepartmentService,
        },
      ],
    }).compile();

    departmentController =
      module.get<DepartmentController>(DepartmentController);
    departmentService = module.get<DepartmentService>(DepartmentService);
  });

  it('should be defined', () => {
    expect(departmentController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new department', async () => {
      const dto: CreateDepartmentDto = { name: 'IT' };
      const result = await departmentController.create(dto);
      expect(result).toEqual({ id: '1', ...dto });
      expect(departmentService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of departments', async () => {
      const result = await departmentController.findAll();
      expect(result).toEqual([{ id: '1', name: 'IT' }]);
      expect(departmentService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a department by id', async () => {
      const result = await departmentController.findOne('1');
      expect(result).toEqual({ id: '1', name: 'IT' });
      expect(departmentService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a department by id', async () => {
      const dto: UpdateDepartmentDto = { name: 'Updated IT' };
      const result = await departmentController.update('1', dto);
      expect(result).toEqual([{ id: '1', ...dto }]);
      expect(departmentService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should delete a department by id', async () => {
      const result = await departmentController.remove('1');
      expect(result).toEqual([{ id: '1', name: 'IT' }]);
      expect(departmentService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('removeAll', () => {
    it('should delete all departments', async () => {
      const result = await departmentController.removeAll();
      expect(result).toEqual([]);
      expect(departmentService.removeAllDeparment).toHaveBeenCalled();
    });
  });
});
