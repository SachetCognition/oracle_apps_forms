import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRequestsController } from './account-requests.controller';
import { AccountRequestsService } from './account-requests.service';
import { AccountRequest } from '../entities/account-request.entity';
import { RegisteredInfo } from '../entities/registered-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountRequest, RegisteredInfo])],
  controllers: [AccountRequestsController],
  providers: [AccountRequestsService],
  exports: [AccountRequestsService],
})
export class AccountRequestsModule {}
