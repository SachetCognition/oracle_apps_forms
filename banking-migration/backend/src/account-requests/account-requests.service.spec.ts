import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AccountRequestsService } from './account-requests.service';
import { AccountRequest } from '../entities/account-request.entity';
import { RegisteredInfo } from '../entities/registered-info.entity';

describe('AccountRequestsService', () => {
  let service: AccountRequestsService;
  let accountRequestRepo: Record<string, jest.Mock>;
  let registeredInfoRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    accountRequestRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((dto) => ({ ...dto, requestId: 1 })),
      findOne: jest.fn(),
    };
    registeredInfoRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountRequestsService,
        { provide: getRepositoryToken(AccountRequest), useValue: accountRequestRepo },
        { provide: getRepositoryToken(RegisteredInfo), useValue: registeredInfoRepo },
      ],
    }).compile();

    service = module.get<AccountRequestsService>(AccountRequestsService);
  });

  const validDto = {
    branch: 'Mumbai',
    accountType: 'Savings',
    title: 'Mr',
    firstName: 'John',
    lastName: 'Doe',
    dob: '1990-01-15',
    workPhone: '1234567890',
    homePhone: '0987654321',
    address: '123 Main Street',
    state: 'Maharashtra',
    zip: '400001',
    email: 'john@test.com',
  };

  // TC-B12: Create account request with valid data
  it('TC-B12: should create account request with valid data', async () => {
    const result = await service.create(validDto);
    expect(result).toHaveProperty('requestId');
    expect(accountRequestRepo.save).toHaveBeenCalled();
  });

  // TC-B13: Create account request with invalid work phone
  it('TC-B13: should reject request with invalid work phone', async () => {
    await expect(service.create({ ...validDto, workPhone: '12345' })).rejects.toThrow(BadRequestException);
  });

  // TC-B14: Create account request with invalid home phone
  it('TC-B14: should reject request with invalid home phone', async () => {
    await expect(service.create({ ...validDto, homePhone: '123' })).rejects.toThrow(BadRequestException);
  });

  // TC-B15: Create account request with invalid email
  it('TC-B15: should reject request with invalid email format', async () => {
    await expect(service.create({ ...validDto, email: 'invalid-email' })).rejects.toThrow(BadRequestException);
  });

  // TC-B16: Check status of ENTERED request
  it('TC-B16: should return ENTERED status', async () => {
    accountRequestRepo.findOne.mockResolvedValue({ requestId: 1, status: 'ENTERED' });
    const result = await service.getStatus(1);
    expect(result.status).toBe('ENTERED');
    expect(result.accountNumber).toBeUndefined();
  });

  // TC-B17: Check status of APPROVED request with account number
  it('TC-B17: should return APPROVED status with account number', async () => {
    accountRequestRepo.findOne.mockResolvedValue({ requestId: 1, status: 'APPROVED' });
    registeredInfoRepo.findOne.mockResolvedValue({ accountNumber: 'SAVJOH00001' });
    const result = await service.getStatus(1);
    expect(result.status).toBe('APPROVED');
    expect(result.accountNumber).toBe('SAVJOH00001');
  });

  // TC-B18: Check status of REJECTED request
  it('TC-B18: should return REJECTED status', async () => {
    accountRequestRepo.findOne.mockResolvedValue({ requestId: 1, status: 'REJECTED' });
    const result = await service.getStatus(1);
    expect(result.status).toBe('REJECTED');
  });

  // TC-B19: Check status of non-existent request
  it('TC-B19: should throw NotFoundException for non-existent request', async () => {
    accountRequestRepo.findOne.mockResolvedValue(null);
    await expect(service.getStatus(9999)).rejects.toThrow(NotFoundException);
  });
});
