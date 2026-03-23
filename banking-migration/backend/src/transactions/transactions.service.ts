import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TransactionInfo } from '../entities/transaction-info.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionInfo)
    private readonly transactionRepo: Repository<TransactionInfo>,
  ) {}

  async create(dto: CreateTransactionDto, accountNumber: string): Promise<{ transactionId: number }> {
    if (!/^\d{6}$/.test(dto.chequeNo)) {
      throw new BadRequestException('ChequeNo must be exactly 6 digits');
    }
    if (dto.amount <= 0 || dto.amount > 9999999) {
      throw new BadRequestException('Amount must be greater than 0 and at most 9999999');
    }
    if (!['CR', 'DR'].includes(dto.transactionType)) {
      throw new BadRequestException('Transaction type must be CR or DR');
    }

    const transaction = this.transactionRepo.create({
      accountNumber,
      amount: dto.amount,
      chequeNo: dto.chequeNo,
      transactionType: dto.transactionType,
      transactionDate: new Date(),
    });

    const saved = await this.transactionRepo.save(transaction);
    return { transactionId: saved.transactionId };
  }

  async getHistory(
    accountNumber: string,
    startDate: string,
    endDate: string,
  ): Promise<TransactionInfo[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (end < start) {
      throw new BadRequestException('End date must be on or after start date');
    }
    if (end > today) {
      throw new BadRequestException('End date cannot be in the future');
    }

    return this.transactionRepo.find({
      where: {
        accountNumber,
        transactionDate: Between(start, end),
      },
      order: { transactionDate: 'DESC' },
    });
  }
}
