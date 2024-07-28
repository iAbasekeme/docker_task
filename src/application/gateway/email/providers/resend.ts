import { Resend } from 'resend';
import { Logger } from '@nestjs/common';
import { EmailClient, EmailOptions } from '../email.types';

export type ResendConfig = {
  apiKey: string;
};

export class ResendClient implements EmailClient {
  logger = new Logger(ResendClient.name);
  resend: Resend;

  constructor(config: ResendConfig) {
    this.resend = new Resend(config.apiKey);
  }

  async send(message: string, options: EmailOptions) {
    const { senderName, senderEmail, subject, recipient } = options || {};
    this.logger.log(`within message sender with data `, { options });
    try {
      const { data, error } = await this.resend.emails.send({
        from: senderName ? `${senderName} <${senderEmail}>` : senderEmail,
        to: recipient,
        subject: subject,
        html: message,
      });
      this.logger.log(`Message sent: `, data);
      if (error) {
        throw error;
      }
    } catch (error) {
      this.logger.error('error sending email', error);
      throw error;
    }
  }
}
