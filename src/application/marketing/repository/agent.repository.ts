import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MarketingAgent } from '../entities/agent.entity';

@Injectable()
export class MarketingAgentRepository extends Repository<MarketingAgent> {
  constructor(private dataSource: DataSource) {
    super(MarketingAgent, dataSource.createEntityManager());
  }
}
