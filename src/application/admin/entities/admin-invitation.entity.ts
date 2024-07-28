import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateColumn } from 'typeorm';

@Entity({ name: 'admin_invitations' })
export class AdminInvitation {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: false })
  email: string;

  @Column({ name: 'used_at', nullable: true })
  usedAt?: Date;

  @Column({ name: 'expires_at', nullable: false })
  expiresAt?: Date;

  @Column({ name: 'invite_id', nullable: false, unique: true })
  inviteId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
