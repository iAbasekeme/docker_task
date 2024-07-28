import { FindOptionsWhere, ILike } from 'typeorm';
import { pick } from 'ramda';
import { FindHotelStaffDto } from '../dto/find-hotel-staff.dto';
import { HotelStaff } from '../entities/hotel-staff.entity';

export class HotelStaffMapper {
  static toDB(
    dto: FindHotelStaffDto | Partial<HotelStaff>,
  ): FindOptionsWhere<HotelStaff> | FindOptionsWhere<HotelStaff>[] {
    const findUserDto = dto as FindHotelStaffDto;
    const staffAttributes = pick(this.staffAttributes, dto as HotelStaff);
    const dbQuery: FindOptionsWhere<HotelStaff> = {
      ...staffAttributes,
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

  static staffAttributes: Array<
    keyof Omit<HotelStaff, 'normalizeUserName' | 'normalizeEmail' | 'toJSON'>
  > = [
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
    'hotelId',
    'createdAt',
    'updatedAt',
  ];
}
