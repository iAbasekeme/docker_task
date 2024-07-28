import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OtpService } from '../otp/otp.service';
import { BankDetailRepository } from './bank-detail.repository';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank-detail.dto';
import { Bank } from './entities/bank-detail.entity';
import { HotelRepository } from '../hotel/hotel.repository';
import { omit } from 'ramda';

@Injectable()
export class BankDetailService {
  constructor(
    private readonly otpService: OtpService,
    private bankDetailRepository: BankDetailRepository,
    private hotelRepository: HotelRepository,
  ) {}

  private async validate(
    dto:
      | CreateBankDetailDto
      | (UpdateBankDetailDto & { accountDetailsId: string }),
  ) {
    const updateDto = dto as UpdateBankDetailDto & { accountDetailsId: string };

    if (updateDto?.accountDetailsId) {
      const bankDetails = this.bankDetailRepository.findOne({
        where: {
          id: updateDto.accountDetailsId,
          ...(updateDto.hotelId ? { hotelId: updateDto.hotelId } : {}),
        },
      });
      if (!bankDetails) {
        throw new BadRequestException('not found');
      }
    }

    const isValidOtp = await this.otpService.validateOtpId(dto.otpId);
    if (!isValidOtp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (dto.hotelId) {
      const hotel = await this.hotelRepository.findOne({
        where: { id: dto.hotelId },
      });
      if (!hotel) {
        throw new NotFoundException('invalid hotel id');
      }
    }

    if (dto.accountNumber && dto.hotelId) {
      const exists = await this.bankDetailRepository.findOne({
        where: {
          accountNumber: dto.accountNumber,
          hotelId: dto.hotelId,
        },
      });
      if (exists) {
        throw new ConflictException('duplicate account number');
      }
    }
  }

  async create(createBankDetailDto: CreateBankDetailDto) {
    await this.validate(createBankDetailDto);

    const newBank = new Bank();
    newBank.hotelId = createBankDetailDto.hotelId;
    newBank.accountName = createBankDetailDto.accountName;
    newBank.accountNumber = createBankDetailDto.accountNumber;
    newBank.bankName = createBankDetailDto.bankName;
    newBank.bankSortCode = createBankDetailDto.bankSortCode;
    newBank.default = createBankDetailDto.default;

    if (createBankDetailDto.default) {
      await this.bankDetailRepository.update(
        { hotelId: createBankDetailDto.hotelId },
        { default: false },
      );
    }

    return await this.bankDetailRepository.save(newBank);
  }

  async list(hotelId: string) {
    return await this.bankDetailRepository.find({
      where: {
        hotelId,
      },
    });
  }

  async update(
    accountId: string,
    hotelId: string,
    updateBankDetailDto: UpdateBankDetailDto,
  ) {
    await this.validate({
      ...updateBankDetailDto,
      accountDetailsId: accountId,
    });

    if ('default' in updateBankDetailDto) {
      await this.bankDetailRepository.update({ hotelId }, { default: false });
    }

    return await this.bankDetailRepository.save({
      id: accountId,
      ...omit(['otpId'], updateBankDetailDto),
    });
  }

  async delete(accountId: string, hotelId: string) {
    const bank = await this.bankDetailRepository.findOne({
      where: { id: accountId, hotelId },
    });
    if (bank) {
      await this.bankDetailRepository.delete({ id: bank.id });
      return { message: 'Bank deleted', success: true };
    }
    return { message: 'Bank already deleted', success: true };
  }
}
