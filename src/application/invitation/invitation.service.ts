import {
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InvitationDto, InvitationLinkDto } from './dto/invitation.dto';
import { Invitations } from './entities/invitation.entity';
import { InvitationRepository } from './invitation.repository';
import { generateTokenChar, time } from '../../lib/utils.lib';
import { NotificationService } from '../notification/notification.service';
import { Channel } from '../notification/notification.type';

@Injectable()
export class InvitationService {
  invitationTTLSeconds = 1 * 24 * 60 * 60; // 24 hours
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async invalidateAllInvitesSentToRecipient(email: string) {
    await this.invitationRepository.update(
      { email },
      { expiresAt: time().init().toDate(), usedAt: time().init().toDate() },
    );
  }

  async create(invite: Invitations) {
    if (invite.email) {
      await this.invalidateAllInvitesSentToRecipient(invite.email);
    }
    return this.invitationRepository.save(invite);
  }

  async validate(dto: { inviteId: string; email: string }) {
    const invitation = await this.invitationRepository.findOne({
      where: { inviteId: dto.inviteId },
    });
    if (!invitation) {
      throw new NotFoundException('Invitation not found.');
    }
    if (invitation.usedAt) {
      throw new GoneException(
        'This invitation has already been used or is invalid.',
      );
    }
    if (
      invitation.email &&
      invitation.email.toLowerCase() !== dto.email.toLowerCase()
    ) {
      throw new ForbiddenException(
        'This invitation is intended for a different user. Please check for your own invitation or contact support for assistance.',
      );
    }
    if (time(invitation.expiresAt).init().isBefore(time().init())) {
      throw new GoneException('This invitation has expired');
    }
    return invitation;
  }

  async useInvitation(dto: { inviteId: string; email: string }) {
    const invitation = await this.validate(dto);
    return await this.invitationRepository.save({
      id: invitation.id,
      usedAt: time().init().toDate(),
    });
  }

  async generateLink(invitationDto?: InvitationLinkDto) {
    const newInvite = new Invitations();
    newInvite.inviteId = generateTokenChar(30);
    if (invitationDto?.email) {
      newInvite.email = invitationDto.email.toLowerCase();
    }
    newInvite.expiresAt = time()
      .init()
      .add(this.invitationTTLSeconds, 'seconds')
      .toDate();
    const saved = await this.create(newInvite);
    return {
      ...saved,
      url: `https://tracman.app/admin/invitations?inviteId=${saved.inviteId}${
        saved.email ? `&email=${saved.email}` : ''
      }`,
    };
  }

  async initiate(invitationDto: InvitationDto) {
    const { emails } = invitationDto;
    const invitationsPromise: Promise<Invitations & { url: string }>[] = [];
    for (const email of emails) {
      invitationsPromise.push(this.generateLink({ email }));
    }
    const invitations = await Promise.all(invitationsPromise);
    for (const i of invitations) {
      await this.notificationService.send({
        title: 'You have been invited to join tracman',
        content: '',
        channels: [Channel.email],
        recipient: { email: i.email },
        template: 'admin-invite',
        sender: {
          name: 'tracman',
          id: 'mail@tracman.app',
        },
        metadata: {
          recipient: i.email,
          inviteId: i.inviteId,
          url: i.url,
          expiresAt: i.expiresAt,
        },
      });
    }
    return { success: true, message: 'invitations sent' };
  }
}
