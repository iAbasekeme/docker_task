import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { jwtConstants } from '../../../config/env.config';
import { AccessTokenPayload } from '../types/access-token-payload.type';
import { PersonFactory, RoleToAppMap } from '../factories/person.factory';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger = new Logger(PassportStrategy.name);
  constructor(private personFactory: PersonFactory) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: AccessTokenPayload) {
    const person = await this.personFactory.retrievePerson(
      payload.email,
      RoleToAppMap[payload.role],
    );
    if (!person) {
      throw new UnauthorizedException('You must login first');
    }
    delete person.password
    return person;
  }
}
