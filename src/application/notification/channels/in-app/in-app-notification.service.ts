import { Injectable, Logger } from '@nestjs/common';

import {
  NotificationChannel,
  NotificationPayload,
  Recipient,
} from '../../notification.type';
import { OutboundNotification } from '../../entities/outbound-notification.entity';
import { InAppNotificationRepository } from './in-app-notification.repository';
import { InAppNotification } from './entities/in-app-notification.entity';
import { FindInappNotificationDto } from './dto/find-inapp.dto';
import { InappNotificationMapper } from './domain/inapp.mapper';
import { PaginatedResult, Pagination } from '../../../../lib/pagination.lib';

@Injectable()
export class InAppNotificationService extends NotificationChannel {
  logger = new Logger(InAppNotificationService.name);

  constructor(
    private inAppNotificationRepository: InAppNotificationRepository,
  ) {
    super();
  }

  async send(
    recipient: Recipient,
    payload: NotificationPayload,
    outboundNotification?: OutboundNotification,
  ) {
    await this.inAppNotificationRepository.save({
      notificationId: payload.notificationId,
      personId: recipient.personId,
      personType: recipient.personType,
      outBoundNotificationId: outboundNotification.id,
    });
  }

  async find(dto: Partial<InAppNotification | FindInappNotificationDto>) {
    const { page, perPage } = dto as FindInappNotificationDto;
    const pagination = new Pagination(page, perPage);
    const [result, total] = await this.inAppNotificationRepository.findAndCount(
      {
        where: InappNotificationMapper.toDB(dto),
        take: pagination.perPage,
        skip: pagination.skip,
        order: {
          createdAt: 'DESC',
        },
      },
    );
    return PaginatedResult.create(result, total, pagination);
  }
}
