import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Bank } from './entities/bank-detail.entity';

@Injectable()
export class BankDetailRepository extends Repository<Bank> {
  constructor(private datasource: DataSource) {
    super(Bank, datasource.createEntityManager());
  }
}
