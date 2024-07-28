import { Injectable, NotFoundException } from '@nestjs/common';
import { HotelRepository } from '../hotel.repository';
import { Hotel } from '../entities/hotel.entity';
import { RoomImageRepository } from 'src/application/room/room-image/room-image.repository';
import { prettyPrintArray } from 'src/lib/utils.lib';

export type VerificationResponse = {
  stepNumber: number;
  name: VerificationStages;
  status: 'done' | 'in progress' | 'pending';
  messages?: string[];
};

export type VerificationStages =
  | 'Basic Information'
  | 'Location Verification'
  | 'Hotel Setup'
  | 'Final Approval';

@Injectable()
export class ResolveHotelVerificationStages {
  hotel: Hotel;
  constructor(
    private hotelRepository: HotelRepository,
    private roomImagesRepository: RoomImageRepository,
  ) {}

  async execute(hotelId: string) {
    return await Promise.all([
      this.checkBasicInformation(hotelId),
      this.checkLocation(hotelId),
      this.checkHotelSetup(hotelId),
      this.checkFinalApproval(hotelId),
    ]);
  }

  private async fetchHotel(hotelId: string) {
    if (!this.hotel) {
      const hotel = await this.hotelRepository.findOne({
        where: { id: hotelId },
        relations: ['images'],
      });
      if (!hotel) {
        throw new NotFoundException('Hotel not found or has been deleted');
      }
      this.hotel = hotel;
    }
    return this.hotel;
  }

  async checkBasicInformation(hotelId: string): Promise<VerificationResponse> {
    const messages = [];
    const hotel = await this.fetchHotel(hotelId);
    const isEmailVerified = hotel.isEmailVerified;
    if (!isEmailVerified) {
      messages.push('Email Has not been verified');
    }
    return {
      stepNumber: 1,
      name: 'Basic Information',
      status: isEmailVerified ? 'done' : 'pending',
      messages: messages?.length ? messages : null,
    };
  }

  async checkLocation(hotelId: string): Promise<VerificationResponse> {
    const messages = [];
    const hotel = await this.fetchHotel(hotelId);
    const isCoordinateSet = !!hotel.coordinates;

    const props = [];

    if (!isCoordinateSet) {
      props.push('Co-ordinate');
    }

    if (props.length) {
      messages.push(
        `The following location properties have not been set: ${prettyPrintArray(
          props,
        )}`,
      );
    }

    const isLocationVerificationDone = isCoordinateSet;

    return {
      stepNumber: 2,
      name: 'Location Verification',
      status: isLocationVerificationDone ? 'done' : 'pending',
      messages: messages?.length ? messages : null,
    };
  }

  async checkHotelSetup(hotelId: string): Promise<VerificationResponse> {
    const messages = [];
    const hasAtLeastARoomWithImages = await this.roomImagesRepository.findOne({
      where: {
        room: {
          hotelId,
        },
      },
    });
    const hotel = await this.fetchHotel(hotelId);
    if (!hasAtLeastARoomWithImages) {
      messages.push('Rooms have not been added. Please add rooms with Images');
    }
    if (!hotel.images?.length) {
      messages.push('Hotel does not have images');
    }

    const isDone = hasAtLeastARoomWithImages && hotel.images?.length;

    return {
      stepNumber: 3,
      name: 'Hotel Setup',
      status: isDone ? 'done' : 'pending',
      messages: messages?.length ? messages : null,
    };
  }

  async checkFinalApproval(hotelId: string): Promise<VerificationResponse> {
    const messages = [];
    const hotel = await this.fetchHotel(hotelId);
    if (!hotel.approvedAt) {
      messages.push('Hotel has not been approved by a Tracman Agent');
    }
    return {
      stepNumber: 4,
      name: 'Final Approval',
      status: hotel.approvedAt ? 'done' : 'pending',
      messages: messages?.length ? messages : null,
    };
  }
}
