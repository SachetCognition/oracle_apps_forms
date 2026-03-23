import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AccountRequest } from '../entities/account-request.entity';
import { RegisteredInfo } from '../entities/registered-info.entity';
import { TransactionInfo } from '../entities/transaction-info.entity';
import { Manager } from '../entities/manager.entity';
import { AuditLog } from '../entities/audit-log.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER || 'banking_user',
    password: process.env.DB_PASS || 'banking_pass',
    database: process.env.DB_NAME || 'banking',
    entities: [AccountRequest, RegisteredInfo, TransactionInfo, Manager, AuditLog],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('Database connected. Tables synchronized.');

  const managerRepo = dataSource.getRepository(Manager);
  const existing = await managerRepo.findOne({ where: { username: 'admin' } });
  if (!existing) {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    await managerRepo.save({ username: 'admin', passwordHash });
    console.log('Default manager created: admin / Admin@123');
  } else {
    console.log('Default manager already exists.');
  }

  await dataSource.destroy();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
