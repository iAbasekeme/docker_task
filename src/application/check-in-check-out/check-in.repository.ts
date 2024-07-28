import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CheckInCheckOut } from './entities/check-in-check-out.entity';

@Injectable()
export class CheckInCheckOutRepository extends Repository<CheckInCheckOut> {
  constructor(private dataSource: DataSource) {
    super(CheckInCheckOut, dataSource.createEntityManager());
  }
}
