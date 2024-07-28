import { Module } from '@nestjs/common';
import { PendingReviewService } from './pending-review.service';
import { PendingReviewRepository } from './pending-review.repository';
import { PendingReviewController } from './pending-review.controller';

@Module({
  controllers: [PendingReviewController],
  providers: [PendingReviewService, PendingReviewRepository],
  exports: [PendingReviewService],
})
export class PendingReviewModule {}
