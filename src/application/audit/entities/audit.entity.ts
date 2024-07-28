import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { AuditPayload, OperationType } from '../audit.type';
import { Apps } from 'src/common/types';

@Entity({ name: 'audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    name: 'operation_type',
    nullable: false,
    type: 'character varying',
  })
  operationType: OperationType;

  @Column({ name: 'subject_id', nullable: false })
  subjectId: string;

  @Column({ name: 'subject_type', nullable: false, type: 'character varying' })
  subjectType: AuditPayload['subjectType'];

  @Column({ name: 'description', nullable: false })
  description: string;

  @Column({ name: 'object_type', nullable: false })
  objectType: string;

  @Column({ name: 'object_id', nullable: false })
  objectId: string;

  @Column({ name: 'initial_object_state', nullable: true, type: 'json' })
  initialObjectState: unknown;

  @Column({ name: 'final_object_state', nullable: true, type: 'json' })
  finalObjectState: unknown;

  @Column({ nullable: false })
  action: 'create' | 'update' | 'delete' | 'read';

  @Column({ name: 'target_app', nullable: false, type: 'character varying' })
  targetApp: Apps;

  @Column({ name: 'source_app', nullable: false, type: 'character varying' })
  sourceApp: Apps;

  @Column({ nullable: true, type: 'json' })
  metadata: any;

  @Column({ nullable: false, type: 'character varying' })
  level: AuditPayload['level'];

  @Column({ name: 'request_context', nullable: true, type: 'json' })
  requestContext?: unknown;

  @Column({name: 'sub_description', nullable: true})
  subDescription: string

  @Column({ name: 'target_id', nullable: true })
  targetId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
