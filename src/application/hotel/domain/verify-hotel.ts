import { ForbiddenException, GoneException, Injectable } from '@nestjs/common';
import {
  ResolveHotelVerificationStages,
  VerificationStages,
} from './resolve-hotel-verification-stages';
import { HotelVerificationDto } from '../dto/hotel-verification.dto';
import { Transactional } from 'typeorm-transactional';
import { MarketingAgentService } from 'src/application/marketing/marketing.service';
import * as moment from 'moment';
import { HotelRepository } from '../hotel.repository';

@Injectable()
export class VerifyHotel {
  constructor(
    private resolveHotelVerificationStages: ResolveHotelVerificationStages,
    private agentService: MarketingAgentService,
    private hotelRepository: HotelRepository,
  ) {}

  @Transactional()
  async execute(hotelId: string, dto: HotelVerificationDto) {
    const hotelVerification = await this.resolveHotelVerificationStages.execute(
      hotelId,
    );

    const verifiables = hotelVerification.filter((stage) =>
      (<VerificationStages[]>[
        'Basic Information',
        'Hotel Setup',
        'Location Verification',
      ]).includes(stage.name),
    );
    const incompletes = verifiables.filter((v) => v.status !== 'done');
    if (incompletes.length) {
      throw new ForbiddenException(
        `could not verify hotel for the following reasons: ${incompletes
          .map((i) => i.messages.join('\n'))
          .join('\n')}`,
      );
    }
    const affiliateCodeRecord = await this.agentService.useAffiliateCode(
      hotelId,
      dto.affiliateCode,
      dto?.agentId,
    );
    const alreadyUsedOnHotel = await this.hotelRepository.findOneBy({
      affiliateId: affiliateCodeRecord.id,
    });
    if (alreadyUsedOnHotel) {
      throw new GoneException('Code has already been used');
    }
    return await this.hotelRepository.save({
      id: hotelId,
      approvedAt: moment().toDate(),
      isLocationVerified: true,
      affiliateId: affiliateCodeRecord.id,
    });
  }
}
