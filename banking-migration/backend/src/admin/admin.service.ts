import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AccountRequest } from '../entities/account-request.entity';
import { RegisteredInfo } from '../entities/registered-info.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AccountRequest)
    private readonly accountRequestRepo: Repository<AccountRequest>,
    @InjectRepository(RegisteredInfo)
    private readonly registeredInfoRepo: Repository<RegisteredInfo>,
    private readonly dataSource: DataSource,
  ) {}

  async getPendingRequests(): Promise<AccountRequest[]> {
    return this.accountRequestRepo.find({ where: { status: 'ENTERED' } });
  }

  async getRequestById(requestId: number): Promise<AccountRequest> {
    const request = await this.accountRequestRepo.findOne({ where: { requestId } });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    return request;
  }

  async approve(requestId: number): Promise<{ accountNumber: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const request = await queryRunner.manager.findOne(AccountRequest, { where: { requestId } });
      if (!request) {
        throw new NotFoundException('Request not found');
      }
      if (request.status !== 'ENTERED') {
        throw new BadRequestException('Request is not in ENTERED status');
      }

      // Update status to APPROVED
      request.status = 'APPROVED';
      await queryRunner.manager.save(request);

      // Generate Account_Number using the EXACT algorithm from G1_MANAGERAPPROVAL:
      // K = AccountType + FirstName.substring(0,3).toUpperCase() + padStart(maxSequence + 1, 5, '0')
      const accountTypePrefix = request.accountType.substring(0, 3).toUpperCase();
      const namePrefix = request.firstName.substring(0, 3).toUpperCase();
      const prefix = accountTypePrefix + namePrefix;

      // Find max sequence from existing account numbers with similar prefix
      const existingAccounts = await queryRunner.manager.find(RegisteredInfo);
      let maxSequence = 0;
      for (const acc of existingAccounts) {
        // Extract numeric suffix from account number
        const numericPart = acc.accountNumber.replace(/\D/g, '');
        if (numericPart) {
          const seq = parseInt(numericPart, 10);
          if (seq > maxSequence) {
            maxSequence = seq;
          }
        }
      }

      const accountNumber = prefix + String(maxSequence + 1).padStart(5, '0');

      // Insert into RegisteredInfo with all fields copied from AccountRequest
      const registeredInfo = queryRunner.manager.create(RegisteredInfo, {
        accountNumber,
        requestId: request.requestId,
        branch: request.branch,
        accountType: request.accountType,
        title: request.title,
        firstName: request.firstName,
        lastName: request.lastName,
        dob: request.dob,
        workPhone: request.workPhone,
        homePhone: request.homePhone,
        address: request.address,
        state: request.state,
        zip: request.zip,
        email: request.email,
        onlineRegistration: 'N',
        password: '0000',
      });
      await queryRunner.manager.save(registeredInfo);

      await queryRunner.commitTransaction();
      return { accountNumber };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async reject(requestId: number): Promise<{ message: string }> {
    const request = await this.accountRequestRepo.findOne({ where: { requestId } });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    if (request.status !== 'ENTERED') {
      throw new BadRequestException('Request is not in ENTERED status');
    }

    request.status = 'REJECTED';
    await this.accountRequestRepo.save(request);
    return { message: 'Request rejected' };
  }
}
