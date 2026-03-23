import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RegisteredInfo } from './registered-info.entity';

@Entity('grp1_transactioninfo')
export class TransactionInfo {
  @PrimaryGeneratedColumn({ name: 'transactionid' })
  transactionId: number;

  @Column({ name: 'transactiondate', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transactionDate: Date;

  @Column({ name: 'account_number' })
  accountNumber: string;

  @ManyToOne(() => RegisteredInfo, { nullable: false })
  @JoinColumn({ name: 'account_number' })
  registeredInfo: RegisteredInfo;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'chequeno', length: 10 })
  chequeNo: string;

  @Column({ name: 'transaction_type', length: 2 })
  transactionType: string;
}
