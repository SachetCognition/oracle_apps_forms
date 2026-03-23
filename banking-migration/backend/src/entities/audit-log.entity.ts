import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('audit_log')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'table_name' })
  tableName: string;

  @Column()
  operation: string;

  @Column({ name: 'record_id', nullable: true })
  recordId: string;

  @Column({ name: 'old_values', type: 'jsonb', nullable: true })
  oldValues: Record<string, unknown>;

  @Column({ name: 'new_values', type: 'jsonb', nullable: true })
  newValues: Record<string, unknown>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ name: 'user_id', nullable: true })
  userId: string;
}
