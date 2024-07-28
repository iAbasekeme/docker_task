import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OutboundNotification } from './entities/outbound-notification.entity';

@Injectable()
export class OutboundNotificationRepository extends Repository<OutboundNotification> {
  constructor(private dataSource: DataSource) {
    super(OutboundNotification, dataSource.createEntityManager());
  }
}
