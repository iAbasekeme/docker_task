import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AgentAffiliate } from './agent-affiliate.entity';
import { Gender } from '../../../common/types';

@Entity({ name: 'marketing_agents' })
export class MarketingAgent {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'username', nullable: false, unique: true })
  username?: string;

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, length: 15 })
  gender?: Gender;

  @Column({ name: 'date_of_birth', nullable: true })
  dateOfBirth?: Date;

  @Column({ name: 'phone_number_intl', nullable: true })
  phoneNumberIntl?: string;

  @Column({ name: 'is_email_verified', nullable: false, default: false })
  isEmailVerified: boolean;

  @Column({ name: 'is_phone_number_verified', nullable: false, default: false })
  isPhoneNumberVerified: boolean;

  @OneToMany(() => AgentAffiliate, (affiliate) => affiliate.agent)
  agentAffiliates?: AgentAffiliate[];

  @Column({ name: 'is_active', default: true, nullable: false })
  isActive: boolean;

  @Column({
    name: 'should_receive_notifications',
    nullable: false,
    default: true,
  })
  shouldReceiveNotifications: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @Column({
    name: 'reference_id',
    nullable: false,
    unique: true,
  })
  referenceId: string;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail?() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  @BeforeUpdate()
  normalizeUserName?() {
    if (this.username) {
      this.username = this.username
        .replace(RegExp('^@'), '')
        .replace(/\s+/, '_');
    }
  }

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  toJSON?() {
    const that = this;
    delete that.toJSON;
    delete that.password;
    return that;
  }
}
