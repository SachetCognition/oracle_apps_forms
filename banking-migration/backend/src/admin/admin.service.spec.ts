import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AccountRequest } from '../entities/account-request.entity';
import { RegisteredInfo } from '../entities/registered-info.entity';

describe('AdminService', () => {
  let service: AdminService;
  let accountRequestRepo: Record<string, jest.Mock>;
  let registeredInfoRepo: Record<string, jest.Mock>;
  let mockQueryRunner: Record<string, unknown>;
  let mockManager: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockManager = {
      findOne: jest.fn(),
      save: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockImplementation((_, dto) => dto),
    };

    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: mockManager,
    };

    accountRequestRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    registeredInfoRepo = {
      findOne: jest.fn(),
    };

    const mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: getRepositoryToken(AccountRequest), useValue: accountRequestRepo },
        { provide: getRepositoryToken(RegisteredInfo), useValue: registeredInfoRepo },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  const mockRequest = {
    requestId: 1,
    branch: 'Mumbai',
    accountType: 'Savings',
    title: 'Mr',
    firstName: 'John',
    lastName: 'Doe',
    dob: new Date('1990-01-15'),
    workPhone: '1234567890',
    homePhone: '0987654321',
    address: '123 Main St',
    state: 'Maharashtra',
    zip: '400001',
    email: 'john@test.com',
    status: 'ENTERED',
  };

  // TC-B20: Get pending requests
  it('TC-B20: should return all pending requests', async () => {
    accountRequestRepo.find.mockResolvedValue([mockRequest]);
    const result = await service.getPendingRequests();
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('ENTERED');
  });

  // TC-B21: Approve request generates correct account number
  it('TC-B21: should approve request and generate correct account number', async () => {
    mockManager.findOne.mockResolvedValue({ ...mockRequest });
    mockManager.find.mockResolvedValue([]);
    mockManager.save.mockResolvedValue({});

    const result = await service.approve(1);
    expect(result).toHaveProperty('accountNumber');
    // Account number: AccountType.substring(0,3).toUpperCase() + FirstName.substring(0,3).toUpperCase() + padStart(1, 5, '0')
    expect(result.accountNumber).toBe('SAVJOH00001');
  });

  // TC-B22: Approve request with existing accounts increments sequence
  it('TC-B22: should increment sequence when accounts exist', async () => {
    mockManager.findOne.mockResolvedValue({ ...mockRequest });
    mockManager.find.mockResolvedValue([{ accountNumber: 'SAVJOH00001' }]);
    mockManager.save.mockResolvedValue({});

    const result = await service.approve(1);
    expect(result.accountNumber).toBe('SAVJOH00002');
  });

  // TC-B23: Approve non-existent request
  it('TC-B23: should throw NotFoundException for non-existent request', async () => {
    mockManager.findOne.mockResolvedValue(null);
    await expect(service.approve(9999)).rejects.toThrow(NotFoundException);
  });

  // TC-B24: Approve already processed request
  it('TC-B24: should throw BadRequestException for already approved request', async () => {
    mockManager.findOne.mockResolvedValue({ ...mockRequest, status: 'APPROVED' });
    await expect(service.approve(1)).rejects.toThrow(BadRequestException);
  });

  // TC-B25: Reject request successfully
  it('TC-B25: should reject request and update status', async () => {
    accountRequestRepo.findOne.mockResolvedValue({ ...mockRequest });
    accountRequestRepo.save.mockResolvedValue({});

    const result = await service.reject(1);
    expect(result.message).toBe('Request rejected');
  });

  // TC-B26: Reject non-existent request
  it('TC-B26: should throw NotFoundException when rejecting non-existent request', async () => {
    accountRequestRepo.findOne.mockResolvedValue(null);
    await expect(service.reject(9999)).rejects.toThrow(NotFoundException);
  });

  // TC-B27: Reject already processed request
  it('TC-B27: should throw BadRequestException for already processed request', async () => {
    accountRequestRepo.findOne.mockResolvedValue({ ...mockRequest, status: 'APPROVED' });
    await expect(service.reject(1)).rejects.toThrow(BadRequestException);
  });

  // TC-B28: Get request by ID
  it('TC-B28: should return request details by ID', async () => {
    accountRequestRepo.findOne.mockResolvedValue(mockRequest);
    const result = await service.getRequestById(1);
    expect(result.requestId).toBe(1);
    expect(result.firstName).toBe('John');
  });

  // TC-B29: Get non-existent request by ID
  it('TC-B29: should throw NotFoundException for non-existent request ID', async () => {
    accountRequestRepo.findOne.mockResolvedValue(null);
    await expect(service.getRequestById(9999)).rejects.toThrow(NotFoundException);
  });
});
