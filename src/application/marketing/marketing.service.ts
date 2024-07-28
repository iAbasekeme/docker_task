import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { customAlphabet } from 'nanoid';
import { omit } from 'ramda';
import { isEmail } from 'class-validator';
import { MarketingAgentRepository } from './repository/agent.repository';
import { MarketingAgent } from './entities/agent.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { AgentCreatedEvent } from './events/agent-created.event';
import { AgentAffiliateRepository } from './repository/agent-affiliate.repository';
import {
  buildEntitySortObjectFromQueryParam,
  generateTokenChar,
  hashUtils,
  referenceIdFromName,
} from '../../lib/utils.lib';
import { FindAffiliateCodes } from './dto/find-affiliate-code.dto';
import { PaginatedResult, Pagination } from 'src/lib/pagination.lib';
import { FindOptionsWhere } from 'typeorm';
import { PasswordResetDto } from './dto/password-reset-dto';
import { OtpService } from '../otp/otp.service';
import { FindAgentDto } from './dto/find-agent.dto';
import { InitiateOtpVerificationDto } from '../otp/dto/initiate-otp-verification.dto';
import { NotificationService } from '../notification/notification.service';
import { Channel } from '../notification/notification.type';
import { AgentMapper } from './domain/agent.mapper';
import { FeedbackDto } from './dto/feedback.dto';
import { FeedbackRepository } from './repository/feedback.repository';
import * as moment from 'moment';
import { BaseQueryDto } from 'src/common/dto';

@Injectable()
export class MarketingAgentService {
  logger = new Logger(MarketingAgentService.name);
  constructor(
    private readonly agentRepository: MarketingAgentRepository,
    private eventEmitter: EventEmitter2,
    private agentAffiliateRepository: AgentAffiliateRepository,
    private otpService: OtpService,
    private notificationService: NotificationService,
    private feedbackRepository: FeedbackRepository,
  ) {}

  async findOne(
    criteria:
      | FindOptionsWhere<MarketingAgent>[]
      | FindOptionsWhere<MarketingAgent>,
  ) {
    return this.agentRepository.findOne({ where: criteria });
  }

  private async validate(dto: CreateAgentDto) {
    const [emailExists, usernameExists] = await Promise.all([
      this.findOneByEmailOrUserName(dto.email),
      this.findOneByEmailOrUserName(dto.username),
    ]);
    if (emailExists) {
      throw new ConflictException('Email exists');
    }
    if (usernameExists) {
      throw new ConflictException('Username exists');
    }
  }

  @Transactional()
  async create(dto: CreateAgentDto) {
    dto.email = dto.email.toLowerCase();
    await this.validate(dto);

    dto.password = dto.password || generateTokenChar(4);
    const plainTextPassword = dto.password;
    dto.password = await hashUtils.hash(plainTextPassword);

    const created = await this.agentRepository.save({
      ...dto,
      referenceId: referenceIdFromName(dto),
      isActive: true,
    });

    this.eventEmitter.emit(
      AgentCreatedEvent.eventName,
      new AgentCreatedEvent({ ...created, password: plainTextPassword }),
    );

    return omit(['password'], created);
  }

  async generateAffiliateCode(agent: MarketingAgent) {
    if (!agent.isActive) {
      throw new ForbiddenException(
        'Unable to generate code. Your account is inactive',
      );
    }
    const affiliateCode = generateAffiliateCode(agent.referenceId.slice(0, 2));
    return await this.agentAffiliateRepository.save({
      agentId: agent.id,
      affiliateCode,
    });
  }

  async findAffiliateCodes(query: FindAffiliateCodes) {
    this.logger.log(`findAgent affiliate codes - query - `, query);
    const { page, perPage, sort, search, relations, ...rest } = query || {};
    const paginationOptions = new Pagination(page, perPage);
    const [result, total] = await this.agentAffiliateRepository.findAndCount({
      where: rest,
      take: paginationOptions.perPage,
      skip: paginationOptions.skip,
      order: sort ? buildEntitySortObjectFromQueryParam(sort) : null,
      relations: relations ? relations.split(/\s*,\s*/) : ['hotel'],
    });

    this.logger.log(`Find - Found paginated affiliate codes`, { total });

    return PaginatedResult.create(result, total, paginationOptions);
  }

  async findOneByEmailOrUserName(emailOrUsername: string) {
    return await this.agentRepository.findOne({
      where: isEmail(emailOrUsername)
        ? { email: emailOrUsername.toLowerCase() }
        : { username: emailOrUsername },
    });
  }

  async initiatePasswordReset(otpDto: InitiateOtpVerificationDto) {
    const accountExists = await this.agentRepository.findOne({
      where: { email: otpDto.email.toLowerCase() },
    });
    if (!accountExists) {
      throw new ForbiddenException('account does not exists');
    }
    this.logger.log('initiateOtpVerification - data - ', otpDto);
    const otp = await this.otpService.create({
      userId: (otpDto.email || otpDto.phoneNumberIntl).toLowerCase(),
    });
    await this.notificationService.send({
      title: `Your OTP Code is ${otp.plainTextCode}`,
      content: '',
      channels: [otpDto.email ? Channel.email : Channel.sms],
      recipient: otpDto.email
        ? { email: otpDto.email }
        : { phoneNumber: otpDto.phoneNumberIntl },
      template: 'password-reset-initiate',
      sender: {
        name: 'tracman',
        id: 'mail@tracman.app',
      },
      metadata: {
        recipient: otpDto.email,
        otp: otp.plainTextCode,
        userReference: otp.userId,
        otpId: otp.id,
      },
    });
    return {
      expiresAt: otp.expiresAt,
      otpId: otp.id,
    };
  }

  async resetPassword(passwordResetDto: PasswordResetDto) {
    const verified = await this.otpService.verifyOtp({
      otpCode: passwordResetDto.otpCode,
      otpId: passwordResetDto.otpId,
    });
    if (verified) {
      const verifiedOtpData = verified.data;
      await this.agentRepository.update(
        { email: verifiedOtpData.userId },
        { password: await hashUtils.hash(passwordResetDto.newPassword) },
      );
      return { success: true, message: 'password reset successful' };
    }
    throw new BadRequestException('password reset unsuccessful');
  }

  async findAgents(query: FindAgentDto) {
    this.logger.log(`findAgent - query - `, query);
    const { page, perPage, sort, relations } = query || {};
    const paginationOptions = new Pagination(page, perPage);
    const [result, total] = await this.agentRepository.findAndCount({
      where: AgentMapper.toDB(query),
      take: paginationOptions.perPage,
      skip: paginationOptions.skip,
      order: sort
        ? buildEntitySortObjectFromQueryParam(sort)
        : { createdAt: 'DESC' },
      relations: relations ? relations.split(/\s*,\s*/) : null,
    });

    this.logger.log(`Find - Found paginated agents`, { total });

    return PaginatedResult.create(result, total, paginationOptions);
  }

  async suspendAgent(agentId: string) {
    const agent = await this.agentRepository.findOne({
      where: { id: agentId },
    });
    if (!agent) {
      throw new NotFoundException('agent not found');
    }
    return await this.agentRepository.save({
      id: agentId,
      isActive: !agent.isActive,
    });
  }

  async restoreAgent(agentId: string) {
    return await this.agentRepository.save({ id: agentId, isActive: true });
  }

  async deleteAgent(agentId: string) {
    await this.agentRepository.softDelete({ id: agentId });
    return { message: 'successfully deleted agent' };
  }

  async createFeedback(dto: FeedbackDto) {
    return await this.feedbackRepository.save(dto);
  }

  @Transactional()
  async useAffiliateCode(hotelId: string, code: string, agentId?: string) {
    const affiliateCode = await this.agentAffiliateRepository.findOne({
      where: {
        affiliateCode: code,
        ...(agentId ? { id: agentId } : {}),
      },
    });
    if (!affiliateCode) {
      throw new NotFoundException('Code not found');
    }
    if (affiliateCode.timeOfUse) {
      throw new GoneException('Code has already been used');
    }
    return await this.agentAffiliateRepository.save({
      id: affiliateCode.id,
      timeOfUse: moment().toDate(),
    });
  }

  async findHotelsOnboarded(dto: BaseQueryDto & { agentId: string }) {
    return this.agentAffiliateRepository.findHotelsOnboarded(dto);
  }
}

function generateAffiliateCode(pad: string) {
  const alphabet = '0123456789';
  const nanoid = customAlphabet(alphabet, 15);
  return `${pad}-${nanoid()}`;
}
