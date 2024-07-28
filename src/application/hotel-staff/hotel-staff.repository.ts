import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HotelStaff } from './entities/hotel-staff.entity';

@Injectable()
export class HotelStaffRepository extends Repository<HotelStaff> {
  constructor(private dataSource: DataSource) {
    super(HotelStaff, dataSource.createEntityManager());
  }
}
