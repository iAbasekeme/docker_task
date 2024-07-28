import { User } from "../../user/entities/user.entity";

export type LoginResponse = {
    accessToken: string;
    user: User
  };