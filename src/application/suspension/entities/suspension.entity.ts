import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'suspensions' })
export class Suspension {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  reason?: string;

  @Column({ name: 'entity_id', nullable: false, type: 'uuid' })
  entityId: string;

  @Column({ name: 'entity_type', nullable: false })
  entityType: 'user' | 'agent' | 'hotel' | 'hotel-staff';

  @Column({
    name: 'supposed_released_at',
    type: 'timestamptz',
    nullable: true,
  })
  supposedReleasedAt: Date;

  @Column({ name: 'released_at', type: 'timestamptz', nullable: true })
  releasedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
