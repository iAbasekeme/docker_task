import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MarketingAgentService } from './marketing.service';
import { Roles } from '../access-control/decorators/role.decorator';
import { Role } from '../access-control/access-control.constant';
import { RoleGuard } from '../access-control/guards/role.guard';
import { CreateAgentDto } from './dto/create-agent.dto';
import { AuthUser } from '../authentication/decorators/user.decorator';
import { MarketingAgent } from './entities/agent.entity';
import { FindAffiliateCodes } from './dto/find-affiliate-code.dto';
import { PasswordResetDto } from './dto/password-reset-dto';
import { Public } from '../authentication/decorators/public.decorator';
import { FindAgentDto } from './dto/find-agent.dto';
import { InitiateOtpVerificationDto } from '../otp/dto/initiate-otp-verification.dto';
import { FeedbackDto } from './dto/feedback.dto';
import { Person } from '../authentication/factories/person.factory';
import { validateAgentRequest } from 'src/common/validate-hotel-request.middleware';
import { BaseQueryDto } from 'src/common/dto';

@Controller('v1')
export class MarketingController {
  constructor(private marketingService: MarketingAgentService) {}

  @Post('agents')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  create(@Body() dto: CreateAgentDto) {
    return this.marketingService.create(dto);
  }

  @Get('agents/:id')
  @Roles(Role.MARKETING_AGENT)
  @UseGuards(RoleGuard)
  findAgent(@Param('id') agentId: string) {
    return this.marketingService.findOne({ id: agentId });
  }

  @Get('agents')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  findAgents(@Query() dto: FindAgentDto) {
    return this.marketingService.findAgents(dto);
  }

  @Post('agents/affiliate-codes')
  @Roles(Role.MARKETING_AGENT)
  @UseGuards(RoleGuard)
  generateAffiliateCode(@AuthUser() loggedInUser: MarketingAgent) {
    return this.marketingService.generateAffiliateCode(loggedInUser);
  }

  @Get('agents/affiliate-codes')
  @Roles(Role.MARKETING_AGENT)
  @UseGuards(RoleGuard)
  findAffiliateCodes(
    @AuthUser() loggedInUser: MarketingAgent,
    @Query() dto: FindAffiliateCodes,
  ) {
    return this.marketingService.findAffiliateCodes({
      ...dto,
      agentId: loggedInUser.id,
    });
  }

  @Get('agents/:id/affiliate-codes')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  findAffiliateCodesAdmin(
    @Param('id') agentId: string,
    @Query() dto: FindAffiliateCodes,
  ) {
    return this.marketingService.findAffiliateCodes({ ...dto, agentId });
  }

  @Post('agents/password-reset/initiate')
  @Public()
  initiateOtpVerification(@Body() otp: InitiateOtpVerificationDto) {
    return this.marketingService.initiatePasswordReset(otp);
  }

  @Post('agents/password-reset')
  @Public()
  resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    return this.marketingService.resetPassword(passwordResetDto);
  }

  @Post('agents/:id/suspensions')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  suspendAgent(@Param('id', ParseUUIDPipe) agentId: string) {
    return this.marketingService.suspendAgent(agentId);
  }

  @Post('agents/:id/restored')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  restoreAgent(@Param('id', ParseUUIDPipe) agentId: string) {
    return this.marketingService.restoreAgent(agentId);
  }

  @Delete('agents/:id')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  deleteAgent(@Param('id', ParseUUIDPipe) agentId: string) {
    return this.marketingService.deleteAgent(agentId);
  }

  @Post('feedbacks')
  @Public()
  createFeedback(@Body() dto: FeedbackDto) {
    return this.marketingService.createFeedback(dto);
  }

  @Get('agents/:agentId/hotels-onboarded')
  @Roles(Role.MARKETING_AGENT)
  @UseGuards(RoleGuard)
  findHotelsOnboarded(
    @Param('agentId') agentId: string,
    @AuthUser() person: Person,
    @Query() dto: BaseQueryDto,
  ) {
    validateAgentRequest(person, agentId);
    return this.marketingService.findHotelsOnboarded({ ...dto, agentId });
  }
}
