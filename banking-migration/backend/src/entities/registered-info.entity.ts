import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AccountRequest } from './account-request.entity';

@Entity('grp1_registeredinfo')
export class RegisteredInfo {
  @PrimaryColumn({ name: 'account_number' })
  accountNumber: string;

  @Column({ name: 'requestid', nullable: true })
  requestId: number;

  @ManyToOne(() => AccountRequest, { nullable: true })
  @JoinColumn({ name: 'requestid' })
  accountRequest: AccountRequest;

  @Column({ name: 'branch', length: 15 })
  branch: string;

  @Column({ name: 'account_type', length: 15 })
  accountType: string;

  @Column({ name: 'title', length: 4 })
  title: string;

  @Column({ name: 'firstname', length: 15 })
  firstName: string;

  @Column({ name: 'lastname', length: 15 })
  lastName: string;

  @Column({ name: 'dob', type: 'date' })
  dob: Date;

  @Column({ name: 'workphone', length: 10 })
  workPhone: string;

  @Column({ name: 'homephone', length: 10 })
  homePhone: string;

  @Column({ name: 'address', length: 30 })
  address: string;

  @Column({ name: 'state', length: 15 })
  state: string;

  @Column({ name: 'zip', length: 10 })
  zip: string;

  @Column({ name: 'email', length: 30 })
  email: string;

  @Column({ name: 'online_registration', length: 1, default: 'N' })
  onlineRegistration: string;

  @Column({ name: 'password', length: 255, nullable: true })
  password: string;
}
