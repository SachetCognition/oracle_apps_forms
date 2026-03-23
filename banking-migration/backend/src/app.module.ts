import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AccountRequestsModule } from './account-requests/account-requests.module';
import { AdminModule } from './admin/admin.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AccountRequest } from './entities/account-request.entity';
import { RegisteredInfo } from './entities/registered-info.entity';
import { TransactionInfo } from './entities/transaction-info.entity';
import { Manager } from './entities/manager.entity';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER || 'banking_user',
      password: process.env.DB_PASS || 'banking_pass',
      database: process.env.DB_NAME || 'banking',
      entities: [AccountRequest, RegisteredInfo, TransactionInfo, Manager, AuditLog],
      synchronize: true,
    }),
    AuthModule,
    AccountRequestsModule,
    AdminModule,
    TransactionsModule,
  ],
})
export class AppModule {}
