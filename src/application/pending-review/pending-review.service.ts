import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PendingReview } from './entities/pending-review.entity';
import { PendingReviewRepository } from './pending-review.repository';
import { time } from 'src/lib/utils.lib';
import { FindOptionsWhere, IsNull } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class PendingReviewService {
  logger = new Logger(PendingReviewService.name);
  constructor(private pendingReviewRepository: PendingReviewRepository) {}

  findOne(query: FindOptionsWhere<PendingReview>) {
    return this.pendingReviewRepository.findOne({ where: query });
  }

  @Transactional()
  async create(pendingReview: PendingReview) {
    const exists = await this.findOne({
      userId: pendingReview.userId,
      bookingId: pendingReview.bookingId,
    });
    if (!exists) {
      return await this.pendingReviewRepository.save(pendingReview);
    }
    this.logger.debug('pending review already exists', pendingReview);
    throw new NotFoundException('pending review already exists');
  }

  async clear(userId: string) {
    await this.use({ userId });
    return { success: true, message: 'cleared' };
  }

  async check(query: FindOptionsWhere<PendingReview>) {
    const pendingReview = await this.findOne({ ...query, usedAt: IsNull() });
    return {
      exists: pendingReview ? true : false,
      data: pendingReview || null,
    };
  }

  async list(userId: string) {
    return await this.pendingReviewRepository.find({
      where: { userId, usedAt: IsNull() },
      relations: ['hotel', 'room', 'booking'],
    });
  }

  async use(query: FindOptionsWhere<PendingReview>) {
    return await this.pendingReviewRepository.update(query, {
      usedAt: time().toDate(),
    });
  }
}
