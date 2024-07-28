import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { FindAuditDto } from './dto/find-audit.dto';
import { Roles } from '../access-control/decorators/role.decorator';
import { Role } from '../access-control/access-control.constant';
import { RoleGuard } from '../access-control/guards/role.guard';
import { AuthUser } from '../authentication/decorators/user.decorator';
import { Person } from '../authentication/factories/person.factory';
import { HotelStaff } from '../hotel-staff/entities/hotel-staff.entity';
import { Apps } from '../../common/types';

@Controller('v1')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get('audits')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  find(@Query() query: FindAuditDto) {
    return this.auditService.find(query);
  }

  @Get('hotels/:hotelId/audits')
  @Roles(Role.HOTEL_STAFF)
  @UseGuards(RoleGuard)
  findByHotel(
    @Query() query: FindAuditDto,
    @Param('hotelId', ParseUUIDPipe) hotelId: string,
    @AuthUser() subject: Person,
  ) {
    if (hotelId !== (<HotelStaff>subject)?.hotelId) {
      throw new ForbiddenException(
        'you cannot access resource of another hotel',
      );
    }
    query.targetId = hotelId;
    query.targetApp = Apps.Hotel;
    return this.auditService.find(query, [
      'id',
      'action',
      'description',
      'subDescription',
      'targetApp',
      'targetId',
      'objectType',
      'objectId',
      'createdAt',
      'operationType',
      'subjectType',
      'subjectId'
    ]);
  }
}
