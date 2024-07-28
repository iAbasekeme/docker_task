import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { Apps } from '../../../common/types';
import { Admin } from '../../admin/entities/admin.entity';
import { MarketingAgent } from '../../marketing/entities/agent.entity';
import { HotelStaff } from '../../hotel-staff/entities/hotel-staff.entity';
import { MarketingAgentService } from '../../marketing/marketing.service';
import { AdminService } from '../../admin/admin.service';
import { HotelStaffService } from '../../hotel-staff/hotel-staff.service';
import { Role } from '../../access-control/access-control.constant';
import { UserService } from '../../../application/user/user.service';

@Injectable()
export class PersonFactory {
  constructor(
    private agentService: MarketingAgentService,
    private adminService: AdminService,
    private hotelStaffService: HotelStaffService,
    private userService: UserService,
  ) {}

  async retrievePerson(emailOrUserName: string, app: Apps) {
    let person: Person;
    if (app === Apps.User) {
      person = await this.retrieveUser(emailOrUserName);
    } else if (app === Apps.Admin) {
      person = await this.retrieveAdmin(emailOrUserName);
    } else if (app === Apps.Hotel) {
      person = await this.retrieveHotelStaff(emailOrUserName);
    } else if (app === Apps.Agent) {
      person = await this.retrieveMarketingAgent(emailOrUserName);
    }
    return person;
  }

  private async retrieveUser(emailOrUserName: string) {
    const user = await this.userService.findOneByEmailOrUserName(
      emailOrUserName,
    );
    if (!user) {
      throw new UnauthorizedException('User not found');
    } else if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account is inactive, please contact support',
      );
    }
    return { ...user, role: Role.USER };
  }

  private async retrieveAdmin(emailOrUserName: string) {
    const admin = await this.adminService.findOneByEmailOrUserName(
      emailOrUserName,
    );
    if (!admin) {
      throw new UnauthorizedException(
        'Could not find an admin account associated with the passed in credentials',
      );
    } else if (!admin.isActive) {
      throw new UnauthorizedException(
        'Your account is inactive, please contact support',
      );
    }
    return { ...admin, role: Role.ADMIN };
  }

  private async retrieveHotelStaff(emailOrUserName: string) {
    const staff = await this.hotelStaffService.findOneByEmailOrUserName(
      emailOrUserName,
    );
    if (!staff) {
      throw new UnauthorizedException(
        'Could not find a hotel staff account associated with the passed in credentials',
      );
    } else if (!staff.isActive) {
      throw new UnauthorizedException(
        'Your account is inactive, please contact support',
      );
    } else if (!staff.hotel?.isActive) {
      throw new UnauthorizedException(
        'Your Hotel is inactive or has been deleted, please contact support',
      );
    }
    return {
      ...staff,
      type: staff.role,
      role: staff.role === 'owner' ? Role.HOTEL_ADMIN : Role.HOTEL_STAFF,
    };
  }

  private async retrieveMarketingAgent(emailOrUserName: string) {
    const agent = await this.agentService.findOneByEmailOrUserName(
      emailOrUserName,
    );
    if (!agent) {
      throw new UnauthorizedException(
        'Could not find an agent account associated with the passed in credentials',
      );
    }
    return {
      ...agent,
      role: Role.MARKETING_AGENT,
    };
  }
}

export type Person = (User | Admin | MarketingAgent | HotelStaff) & {
  role?: Role;
};

export const RoleToAppMap = {
  [Role.ADMIN]: Apps.Admin,
  [Role.HOTEL_ADMIN]: Apps.Hotel,
  [Role.HOTEL_STAFF]: Apps.Hotel,
  [Role.MARKETING_AGENT]: Apps.Agent,
  [Role.USER]: Apps.User,
};
