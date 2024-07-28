import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { State } from './entities/state.entity';

@Injectable()
export class StateRepository extends Repository<State> {
  constructor(private dataSource: DataSource) {
    super(State, dataSource.createEntityManager());
  }
}
