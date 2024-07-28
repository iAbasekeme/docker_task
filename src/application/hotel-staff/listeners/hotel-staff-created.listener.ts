import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../../notification/notification.service';
import { Channel } from '../../notification/notification.type';
import {
  HotelStaffCreatedEvent,
  HotelStaffCreatedEventPayload,
} from '../events/hotel-staff-created.event';
import { capitalize } from '../../../lib/utils.lib';
import { HotelService } from 'src/application/hotel/hotel.service';

@Injectable()
export class HotelStaffCreatedListener {
  logger = new Logger(HotelStaffCreatedListener.name);
  constructor(
    private notificationService: NotificationService,
    private hotelService: HotelService,
  ) {}

  @OnEvent(HotelStaffCreatedEvent.eventName)
  async handleHotelStaffCreated(event: HotelStaffCreatedEvent) {
    try {
      const eventPayload = event.staff;
      if (!eventPayload.hotel) {
        eventPayload.hotel = await this.hotelService.findOne({
          id: eventPayload.hotelId,
        });
      }
      await this.sendWelcomeNotification(eventPayload);
    } catch (error) {
      this.logger.error('error - ', error);
    }
  }

  async sendWelcomeNotification(payload: HotelStaffCreatedEventPayload) {
    await this.notificationService.send({
      title: `You've been added to the hotel ${capitalize(payload.hotel.name)}`,
      content: '',
      channels: [Channel.email],
      recipient: { email: payload.email },
      template: 'hotel-staff-welcome',
      sender: {
        name: 'tracman',
        id: 'mail@tracman.app',
      },
      metadata: {
        hotelName: capitalize(payload.hotel.name),
        hotelStaff: capitalize(payload.firstName),
        role: capitalize(payload.role),
        recipient: payload.email,
        password: payload.password,
      },
    });
  }
}
