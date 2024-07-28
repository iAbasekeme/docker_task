import * as Path from 'path';
import * as fs from 'fs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as Handlebars from 'handlebars';

import { EmailClient } from '../../../gateway/email/email.types';
import {
  NotificationChannel,
  NotificationPayload,
  Recipient,
} from '../../notification.type';
import { printObject } from '../../../../lib/utils.lib';

@Injectable()
export class EmailService extends NotificationChannel {
  logger = new Logger(EmailService.name);
  constructor(private emailProvider: EmailClient) {
    super();
  }

  async send(recipient: Recipient, payload: NotificationPayload) {
    const templateName = payload.template;
    let body = '';
    this.logger.log(
      `send - sending email - template - ${templateName} - payload - `,
      payload,
    );
    const { metadata: context } = payload || {};
    if (templateName) {
      const html = this.html(templateName, context);
      body = html;
    } else {
      body = payload.content;
    }
    try {
      await this.emailProvider.send(body, {
        senderName: payload.sender.name,
        senderEmail: payload.sender.id,
        subject: payload.title,
        recipient: recipient.email,
        context,
      });
    } catch (error) {
      this.logger.error(`send - error sending email - ${printObject(error)}`);
      throw new HttpException(
        'Oops! An Unexpected error occured while sending email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  html(templateName: string, context: any) {
    const pathToTemplate = Path.resolve(
      __dirname,
      'templates',
      `${templateName}.html`,
    );

    const content = fs.readFileSync(pathToTemplate).toString('utf-8');
    const template = Handlebars.compile(content);
    return template(context);
  }
}
