import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../../notification/notification.service';
import { Channel } from '../../notification/notification.type';
import {
  AgentCreatedEvent,
  AgentCreatedEventPayload,
} from '../events/agent-created.event';

@Injectable()
export class AgentCreatedListener {
  logger = new Logger(AgentCreatedListener.name);
  constructor(private notificationService: NotificationService) {}

  @OnEvent(AgentCreatedEvent.eventName)
  async handleAgentCreated(event: AgentCreatedEvent) {
    try {
      const eventPayload = event.agent;
      await this.sendWelcomeNotification(eventPayload);
    } catch (error) {
      this.logger.error('error - ', error);
    }
  }

  async sendWelcomeNotification(payload: AgentCreatedEventPayload) {
    await this.notificationService.send({
      title: `Your account has been successfully profiled as a tracman agent`,
      content: '',
      channels: [Channel.email],
      recipient: { email: payload.email },
      template: 'new-agent',
      sender: {
        name: 'tracman',
        id: 'mail@tracman.app',
      },
      metadata: {
        name: payload.firstName,
        recipient: payload.email,
        password: payload.password
      },
    });
  }
}
