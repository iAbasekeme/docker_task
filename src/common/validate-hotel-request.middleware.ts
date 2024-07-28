import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Person } from '../application/authentication/factories/person.factory';
import { Role } from '../application/access-control/access-control.constant';
import { HotelStaff } from '../application/hotel-staff/entities/hotel-staff.entity';
import { MarketingAgent } from 'src/application/marketing/entities/agent.entity';

@Injectable()
export class ValidateHotelRequestMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const person = req.user as Person;
    const hotelId = req.params.hotelId;
    if (hotelId && person) {
      try {
        validateHotelRequest(person, hotelId);
      } catch (error) {
        next(error);
      }
    }
    next();
  }
}

export function validateHotelRequest(person: Person, hotelId: string) {
  if (
    person.role !== Role.ADMIN &&
    (person as HotelStaff).hotelId !== hotelId
  ) {
    throw new ForbiddenException('you cannot access this resource');
  }
}

export function validateHotelStaffRequest(
  person: Person,
  hotelStaffId: string,
) {
  if (
    person.role !== Role.ADMIN &&
    (person as HotelStaff).id !== hotelStaffId
  ) {
    throw new ForbiddenException('you cannot access this resource');
  }
}

export function validateAgentRequest(person: Person, agentId: string) {
  if (person.role !== Role.ADMIN && (person as MarketingAgent).id !== agentId) {
    throw new ForbiddenException('you cannot access this resource');
  }
}
