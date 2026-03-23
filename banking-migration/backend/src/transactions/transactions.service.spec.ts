import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionInfo } from '../entities/transaction-info.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    transactionRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((dto) => ({ ...dto, transactionId: 1 })),
      find: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getRepositoryToken(TransactionInfo), useValue: transactionRepo },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  // TC-B30: Create transaction with valid data
  it('TC-B30: should create transaction with valid data', async () => {
    const result = await service.create(
      { transactionType: 'CR', amount: 5000, chequeNo: '123456' },
      'SAVJOH00001',
    );
    expect(result).toHaveProperty('transactionId');
  });

  // TC-B31: Create transaction with invalid cheque number
  it('TC-B31: should reject transaction with invalid cheque number', async () => {
    await expect(
      service.create({ transactionType: 'CR', amount: 5000, chequeNo: '12345' }, 'SAVJOH00001'),
    ).rejects.toThrow(BadRequestException);
  });

  // TC-B32: Create transaction with amount out of range
  it('TC-B32: should reject transaction with amount exceeding max', async () => {
    await expect(
      service.create({ transactionType: 'CR', amount: 10000000, chequeNo: '123456' }, 'SAVJOH00001'),
    ).rejects.toThrow(BadRequestException);
  });

  // TC-B33: Create transaction with zero amount
  it('TC-B33: should reject transaction with zero amount', async () => {
    await expect(
      service.create({ transactionType: 'CR', amount: 0, chequeNo: '123456' }, 'SAVJOH00001'),
    ).rejects.toThrow(BadRequestException);
  });

  // TC-B34: Get transaction history with valid dates
  it('TC-B34: should return transactions within date range', async () => {
    transactionRepo.find.mockResolvedValue([
      { transactionId: 1, amount: 5000, transactionType: 'CR' },
    ]);
    const result = await service.getHistory('SAVJOH00001', '2024-01-01', '2024-12-31');
    expect(result).toHaveLength(1);
  });

  // TC-B35: Get transaction history with end date before start date
  it('TC-B35: should reject when end date is before start date', async () => {
    await expect(
      service.getHistory('SAVJOH00001', '2024-12-31', '2024-01-01'),
    ).rejects.toThrow(BadRequestException);
  });
});
