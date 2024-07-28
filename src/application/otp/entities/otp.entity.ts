import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'otps',
})
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ name: 'hashed_code', nullable: false })
  hashedCode: string;

  @Column({ name: 'expires_at', nullable: false, type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'is_verified', default: false, nullable: false })
  isVerified: boolean;

  @Column({ name: 'is_verified_used', nullable: false, default: false })
  isVerifiedUsed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  toJSON?() {
    const that = this;
    delete that.toJSON;
    delete that.hashedCode;
    return that;
  }
}
