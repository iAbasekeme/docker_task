import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { validate } from 'class-validator';
import { Request } from 'express';
import { omit } from 'ramda';
import { plainToInstance } from 'class-transformer';
import { AuthenticationService } from '../authentication.service';
import { LoginDto } from '../dto/login.dto';
import { formatErrors } from '../../../lib/validation-pipe-ext';
import { Apps } from '../../../common/types';
import { Person } from '../factories/person.factory';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationService) {
    super({
      usernameField: 'emailOrUsername',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    emailOrUserName: string,
    password: string,
  ): Promise<Person> {
    const app: Apps = req.body.app || Apps.User;
    await this.validateLoginPayload(emailOrUserName, password, app);
    const person = await this.authService.validate(
      emailOrUserName,
      password,
      app,
    );
    if (!person) {
      throw new UnauthorizedException();
    }
    return omit(['password'], person) as Person;
  }

  private async validateLoginPayload(
    emailOrUsername: string,
    password: string,
    app: Apps,
  ) {
    const loginDto = plainToInstance(LoginDto, {
      emailOrUsername,
      password,
      app,
    });
    const errors = await validate(loginDto);
    if (errors?.length) {
      throw new BadRequestException(
        `Validation failed: ${formatErrors(errors)}`,
      );
    }
  }
}
