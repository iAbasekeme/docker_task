import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.headers.authorization ? super.canActivate(context) : true;
  }

  handleRequest(err: any, user: any, info: Error) {
    if (err || !user) {
      return;
    }
    if (info instanceof Error) {
      throw new UnauthorizedException(info.message);
    }
    return user;
  }
}
