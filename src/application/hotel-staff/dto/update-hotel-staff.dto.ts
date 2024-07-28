import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelStaffDto } from './create-hotel-staff.dto';

export class UpdateHotelStaffDto extends PartialType(CreateHotelStaffDto) {}
