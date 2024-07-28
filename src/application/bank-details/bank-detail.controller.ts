import {
  Controller,
  UseGuards,
  Post,
  Body,
  Param,
  Patch,
  ParseUUIDPipe,
  Get,
  Delete,
  Request,
  Logger,
} from '@nestjs/common';
import { Roles } from '../access-control/decorators/role.decorator';
import { Role } from '../access-control/access-control.constant';
import { RoleGuard } from '../access-control/guards/role.guard';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
import { BankDetailService } from './bank-detail.service';
import { UpdateBankDetailDto } from './dto/update-bank-detail.dto';
import { AuthUser } from '../authentication/decorators/user.decorator';
import {
  Person,
  RoleToAppMap,
} from '../authentication/factories/person.factory';
import { validateHotelRequest } from '../../common/validate-hotel-request.middleware';
import { Bank } from './entities/bank-detail.entity';
import { Request as ExpressRequest } from 'express';
import { AuditBuilder } from '../audit/helpers/audit-builder.helper';
import { Apps } from 'src/common/types';
import { AuditPayload } from '../audit/audit.type';
import { AuditService } from '../audit/audit.service';

@Controller('v1')
export class BankDetailController {
  logger = new Logger(BankDetailController.name);
  constructor(
    private readonly bankDetailService: BankDetailService,
    private readonly auditService: AuditService,
  ) {}

  @Post('hotels/:hotelId/accounts')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  async create(
    @Body() createBankDetailDto: CreateBankDetailDto,
    @Param('hotelId', ParseUUIDPipe) hotelId: string,
    @AuthUser() person: Person,
    @Request() req: ExpressRequest,
  ) {
    validateHotelRequest(person, hotelId);
    createBankDetailDto.hotelId = hotelId;
    const bank = await this.bankDetailService.create(createBankDetailDto);
    this.auditAccount(bank, person, { body: createBankDetailDto, req });
    return bank;
  }

  async auditAccount(
    account: Bank,
    person: Person,
    requestContext: { body: CreateBankDetailDto; req: ExpressRequest },
  ) {
    try {
      const auditBuilder = AuditBuilder.init({
        operationType: 'bank-account-creation',
        subjectId: person?.id,
        subjectType: person?.role,
        action: 'create',
        targetApp: Apps.Hotel,
        targetId: account.hotelId,
        sourceApp: RoleToAppMap[person?.role] || Apps.Hotel,
        level: 'medium',
      } as AuditPayload);
      auditBuilder.setRequestContext(
        [{ type: 'body', data: requestContext.body }],
        requestContext.req.ip,
        person,
      );
      auditBuilder.setDecription(
        `Bank account with details bank name: ${
          account.bankName
        }, account name: ${account.accountName}, account number: ${
          account.accountNumber
        } has been added by ${
          person.role === Role.ADMIN ? 'admin' : person.firstName
        }`,
      );
      auditBuilder.setObject(account.id, 'bank-details');
      await this.auditService.create(auditBuilder);
    } catch (error) {
      this.logger.error(
        `error auditing bank details for hotel with id ${account.hotelId}`,
        error,
      );
    }
  }

  @Get('hotels/:hotelId/accounts')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  list(
    @Param('hotelId', ParseUUIDPipe) hotelId: string,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    return this.bankDetailService.list(hotelId);
  }

  @Patch('hotels/:hotelId/accounts/:accountId')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  update(
    @Body() updateBankDetailDto: UpdateBankDetailDto,
    @Param('accountId') accountId: string,
    @Param('hotelId') hotelId: string,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    return this.bankDetailService.update(
      accountId,
      hotelId,
      updateBankDetailDto,
    );
  }

  @Delete('hotels/:hotelId/accounts/:accountId')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  delete(
    @Param('accountId') accountId: string,
    @Param('hotelId') hotelId: string,
    @AuthUser() person: Person,
  ) {
    validateHotelRequest(person, hotelId);
    return this.bankDetailService.delete(accountId, hotelId);
  }
}
