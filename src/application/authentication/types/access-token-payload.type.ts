import { Role } from '../../access-control/access-control.constant';

export type AccessTokenPayload = {
  email: string;
  sub: string;
  role?: Role;
};
