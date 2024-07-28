import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Suspension } from './entities/suspension.entity';

@Injectable()
export class SuspensionRepository extends Repository<Suspension> {
  constructor(private dataSource: DataSource) {
    super(Suspension, dataSource.createEntityManager());
  }
}
