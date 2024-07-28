import { Post, UseGuards, Body, Controller } from '@nestjs/common';
import { InvitationDto } from './dto/invitation.dto';
import { RoleGuard } from '../access-control/guards/role.guard';
import { Roles } from '../access-control/decorators/role.decorator';
import { Role } from '../access-control/access-control.constant';
import { InvitationService } from './invitation.service';

@Controller('v1')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post('/invitations')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  initiate(@Body() invitationDto: InvitationDto) {
    return this.invitationService.initiate(invitationDto);
  }

  @Post('/invitation-urls')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  generateLink() {
    return this.invitationService.generateLink();
  }
}
