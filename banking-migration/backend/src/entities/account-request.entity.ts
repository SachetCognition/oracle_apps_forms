import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('group1_accountrequest')
export class AccountRequest {
  @PrimaryGeneratedColumn({ name: 'requestid' })
  requestId: number;

  @Column({ name: 'branch', length: 15 })
  branch: string;

  @Column({ name: 'accounttype', length: 15 })
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

  @Column({ name: 'status', length: 10, default: 'ENTERED' })
  status: string;
}
