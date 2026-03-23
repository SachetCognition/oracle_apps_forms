import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { RegisteredInfo } from '../entities/registered-info.entity';
import { Manager } from '../entities/manager.entity';

describe('AuthService', () => {
  let service: AuthService;
  let registeredInfoRepo: Record<string, jest.Mock>;
  let managerRepo: Record<string, jest.Mock>;
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    registeredInfoRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    managerRepo = {
      findOne: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(RegisteredInfo), useValue: registeredInfoRepo },
        { provide: getRepositoryToken(Manager), useValue: managerRepo },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // TC-B01: Customer login with valid credentials
  it('TC-B01: should return JWT for valid customer login', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    registeredInfoRepo.findOne.mockResolvedValue({
      accountNumber: 'SAVJOH00001',
      onlineRegistration: 'Y',
      password: hashedPassword,
    });

    const result = await service.customerLogin('SAVJOH00001', 'password123');
    expect(result).toHaveProperty('access_token');
    expect(jwtService.sign).toHaveBeenCalledWith({ accountNumber: 'SAVJOH00001', role: 'customer' });
  });

  // TC-B02: Customer login with invalid account number
  it('TC-B02: should throw UnauthorizedException for non-existent account', async () => {
    registeredInfoRepo.findOne.mockResolvedValue(null);
    await expect(service.customerLogin('INVALID', 'password123')).rejects.toThrow(UnauthorizedException);
  });

  // TC-B03: Customer login with wrong password
  it('TC-B03: should throw UnauthorizedException for wrong password', async () => {
    const hashedPassword = await bcrypt.hash('correctpassword', 10);
    registeredInfoRepo.findOne.mockResolvedValue({
      accountNumber: 'SAVJOH00001',
      onlineRegistration: 'Y',
      password: hashedPassword,
    });
    await expect(service.customerLogin('SAVJOH00001', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
  });

  // TC-B04: Customer login with unregistered online account
  it('TC-B04: should reject login for account not registered for online banking', async () => {
    registeredInfoRepo.findOne.mockResolvedValue({
      accountNumber: 'SAVJOH00001',
      onlineRegistration: 'N',
      password: '0000',
    });
    await expect(service.customerLogin('SAVJOH00001', '0000')).rejects.toThrow(UnauthorizedException);
  });

  // TC-B05: Manager login with valid credentials
  it('TC-B05: should return JWT for valid manager login', async () => {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    managerRepo.findOne.mockResolvedValue({
      username: 'admin',
      passwordHash: hashedPassword,
    });

    const result = await service.managerLogin('admin', 'Admin@123');
    expect(result).toHaveProperty('access_token');
    expect(jwtService.sign).toHaveBeenCalledWith({ username: 'admin', role: 'manager' });
  });

  // TC-B06: Manager login with invalid credentials
  it('TC-B06: should throw UnauthorizedException for invalid manager credentials', async () => {
    managerRepo.findOne.mockResolvedValue(null);
    await expect(service.managerLogin('admin', 'wrong')).rejects.toThrow(UnauthorizedException);
  });

  // TC-B07: Manager login with wrong password
  it('TC-B07: should throw UnauthorizedException for wrong manager password', async () => {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    managerRepo.findOne.mockResolvedValue({
      username: 'admin',
      passwordHash: hashedPassword,
    });
    await expect(service.managerLogin('admin', 'WrongPass')).rejects.toThrow(UnauthorizedException);
  });

  // TC-B08: Online registration with valid data
  it('TC-B08: should successfully register an account for online banking', async () => {
    registeredInfoRepo.findOne.mockResolvedValue({
      accountNumber: 'SAVJOH00001',
      onlineRegistration: 'N',
      password: '0000',
    });
    registeredInfoRepo.save.mockResolvedValue({});

    const result = await service.register('SAVJOH00001', 'newpassword');
    expect(result.message).toBe('Online registration successful');
    expect(registeredInfoRepo.save).toHaveBeenCalled();
  });

  // TC-B09: Online registration for non-existent account
  it('TC-B09: should throw NotFoundException for non-existent account registration', async () => {
    registeredInfoRepo.findOne.mockResolvedValue(null);
    await expect(service.register('INVALID', 'password123')).rejects.toThrow(NotFoundException);
  });

  // TC-B10: Online registration for already registered account
  it('TC-B10: should throw BadRequestException for already registered account', async () => {
    registeredInfoRepo.findOne.mockResolvedValue({
      accountNumber: 'SAVJOH00001',
      onlineRegistration: 'Y',
    });
    await expect(service.register('SAVJOH00001', 'password123')).rejects.toThrow(BadRequestException);
  });

  // TC-B11: Online registration with password too short
  it('TC-B11: should throw BadRequestException for password shorter than 6 chars', async () => {
    registeredInfoRepo.findOne.mockResolvedValue({
      accountNumber: 'SAVJOH00001',
      onlineRegistration: 'N',
    });
    await expect(service.register('SAVJOH00001', '12345')).rejects.toThrow(BadRequestException);
  });
});
