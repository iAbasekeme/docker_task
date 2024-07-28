import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InAppNotification } from './entities/in-app-notification.entity';

@Injectable()
export class InAppNotificationRepository extends Repository<InAppNotification> {
  constructor(private dataSource: DataSource) {
    super(InAppNotification, dataSource.createEntityManager());
  }
}
