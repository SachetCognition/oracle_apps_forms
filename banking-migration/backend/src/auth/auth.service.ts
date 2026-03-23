import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisteredInfo } from '../entities/registered-info.entity';
import { Manager } from '../entities/manager.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RegisteredInfo)
    private readonly registeredInfoRepo: Repository<RegisteredInfo>,
    @InjectRepository(Manager)
    private readonly managerRepo: Repository<Manager>,
    private readonly jwtService: JwtService,
  ) {}

  async customerLogin(accountNumber: string, password: string): Promise<{ access_token: string }> {
    const account = await this.registeredInfoRepo.findOne({ where: { accountNumber } });
    if (!account) {
      throw new UnauthorizedException('Invalid account number or password');
    }

    if (account.onlineRegistration !== 'Y') {
      throw new UnauthorizedException('Account not registered for online banking');
    }

    const isValid = await bcrypt.compare(password, account.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid account number or password');
    }

    const payload = { accountNumber: account.accountNumber, role: 'customer' };
    return { access_token: this.jwtService.sign(payload) };
  }

  async managerLogin(username: string, password: string): Promise<{ access_token: string }> {
    const manager = await this.managerRepo.findOne({ where: { username } });
    if (!manager) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isValid = await bcrypt.compare(password, manager.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { username: manager.username, role: 'manager' };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(accountNumber: string, password: string): Promise<{ message: string }> {
    const account = await this.registeredInfoRepo.findOne({ where: { accountNumber } });
    if (!account) {
      throw new NotFoundException('Account number not found');
    }

    if (account.onlineRegistration === 'Y') {
      throw new BadRequestException('Account is already registered for online banking');
    }

    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    account.password = hashedPassword;
    account.onlineRegistration = 'Y';
    await this.registeredInfoRepo.save(account);

    return { message: 'Online registration successful' };
  }
}
