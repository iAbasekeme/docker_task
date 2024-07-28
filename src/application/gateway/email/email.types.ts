import { NodemailerConfig } from './providers/nodemailer';
import { ResendConfig } from './providers/resend';

export type EmailOptions = {
  senderName: string;
  senderEmail: string;
  subject: string;
  recipient: string;
  context: any;
  templateName?: string;
};

export interface EmailClient {
  send(html: string, options: EmailOptions): any;
}

export type EmailConfig = NodemailerConfig | ResendConfig;
export enum EMAIl_PROVIDERS {
  nodemailer = 'nodemailer',
  resend = 'resend',
}
