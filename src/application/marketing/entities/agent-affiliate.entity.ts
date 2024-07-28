import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MarketingAgent } from './agent.entity';
import { Hotel } from '../../hotel/entities/hotel.entity';

@Entity({ name: 'agent_affiliates' })
export class AgentAffiliate {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'agent_id', nullable: false })
  agentId: string;

  @ManyToOne(() => MarketingAgent, (agent) => agent.agentAffiliates)
  @JoinColumn({ name: 'agent_id' })
  agent?: MarketingAgent;

  @Column({ name: 'affiliate_code', nullable: false, unique: true })
  affiliateCode: string;

  @OneToOne(() => Hotel, (hotel) => hotel.agentAffiliate)
  hotel: Hotel;

  @Column({ name: 'time_of_use', type: 'timestamptz', nullable: true })
  timeOfUse: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    nullable: false,
  })
  updatedAt: Date;
}
