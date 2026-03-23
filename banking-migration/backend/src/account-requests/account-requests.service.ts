import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountRequest } from '../entities/account-request.entity';
import { RegisteredInfo } from '../entities/registered-info.entity';
import { CreateAccountRequestDto } from './dto/create-account-request.dto';

@Injectable()
export class AccountRequestsService {
  constructor(
    @InjectRepository(AccountRequest)
    private readonly accountRequestRepo: Repository<AccountRequest>,
    @InjectRepository(RegisteredInfo)
    private readonly registeredInfoRepo: Repository<RegisteredInfo>,
  ) {}

  async create(dto: CreateAccountRequestDto): Promise<{ requestId: number }> {
    // Validate phone numbers are exactly 10 digits
    if (!/^\d{10}$/.test(dto.workPhone)) {
      throw new BadRequestException('WorkPhone must be exactly 10 digits');
    }
    if (!/^\d{10}$/.test(dto.homePhone)) {
      throw new BadRequestException('HomePhone must be exactly 10 digits');
    }
    // Validate email
    if (!/^[^@]+@[^@]+\.com$/.test(dto.email)) {
      throw new BadRequestException('Email must be a valid email ending in .com');
    }

    const request = this.accountRequestRepo.create({
      branch: dto.branch,
      accountType: dto.accountType,
      title: dto.title,
      firstName: dto.firstName,
      lastName: dto.lastName,
      dob: dto.dob,
      workPhone: dto.workPhone,
      homePhone: dto.homePhone,
      address: dto.address,
      state: dto.state,
      zip: dto.zip,
      email: dto.email,
      status: 'ENTERED',
    });

    const saved = await this.accountRequestRepo.save(request);
    return { requestId: saved.requestId };
  }

  async getStatus(requestId: number): Promise<{ status: string; accountNumber?: string }> {
    const request = await this.accountRequestRepo.findOne({ where: { requestId } });
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    const result: { status: string; accountNumber?: string } = { status: request.status };

    if (request.status === 'APPROVED') {
      const registered = await this.registeredInfoRepo.findOne({ where: { requestId } });
      if (registered) {
        result.accountNumber = registered.accountNumber;
      }
    }

    return result;
  }
}
