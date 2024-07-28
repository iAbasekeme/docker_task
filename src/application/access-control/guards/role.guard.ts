import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_KEY } from '../decorators/role.decorator';
import { Role } from '../access-control.constant';
import { AccessControlService } from '../access-control.service';
import { capitalize, prettyPrintArray } from '../../../lib/utils.lib';
import { Person } from '../../authentication/factories/person.factory';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessControlService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const person = request.user as Person;

    for (let role of requiredRoles) {
      const result = this.accessControlService.isAuthorized({
        requiredRole: role,
        currentRole: person?.role,
      });

      if (result) {
        return true;
      }
    }

    const readableRequiredRole = requiredRoles.map((role) =>
      capitalize(role.toLowerCase().split('_').join(' ')),
    );

    throw new ForbiddenException(
      `You do not have permissions to carry out this operation. This operation is only permitted for the following roles ${prettyPrintArray(
        readableRequiredRole,
      )}`,
    );
  }
}
