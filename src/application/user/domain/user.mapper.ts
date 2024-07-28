import { FindOptionsWhere, ILike } from 'typeorm';
import { FindUserDto } from '../dto/find-user.dto';
import { User } from '../entities/user.entity';
import { pick } from 'ramda';

export class UserMapper {
  static toDB(
    dto: FindUserDto | Partial<User>,
  ): FindOptionsWhere<User> | FindOptionsWhere<User>[] {
    const findUserDto = dto as FindUserDto;
    const userAttributes = pick(this.userAttributes, dto as User);
    const dbQuery: FindOptionsWhere<User> = {
      ...userAttributes,
    };
    if (findUserDto?.search) {
      const search = findUserDto.search;
      return [
        { ...dbQuery, email: ILike(`%${search}%`) },
        { ...dbQuery, firstName: ILike(`%${search}%`) },
        { ...dbQuery, lastName: ILike(`%${search}%`) },
        { ...dbQuery, username: ILike(`%${search}%`) },
      ];
    }
    return dbQuery;
  }

  static userAttributes: Array<keyof Omit<User, 'normalizeUserName' | 'normalizeEmail' | 'toJSON'>> =
    [
      'id',
      'username',
      'firstName',
      'lastName',
      'email',
      'password',
      'gender',
      'dateOfBirth',
      'phoneNumberIntl',
      'isEmailVerified',
      'isPhoneNumberVerified',
      'isWaitlistUser',
      'isActive',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'ratings',
      'bookings',
    ];
}
