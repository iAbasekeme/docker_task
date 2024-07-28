import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { OtpModule } from '../otp/otp.module';
import { NotificationModule } from '../notification/notification.module';
import { UserBookmarkController } from './user-bookmark.controller';
import { UserBookmarkService } from './user-bookmark.service';
import { UserBookmarkRepository } from './user-bookmark.repository';

@Module({
  imports: [OtpModule, NotificationModule],
  controllers: [UserController, UserBookmarkController],
  providers: [
    UserService,
    UserRepository,
    UserBookmarkService,
    UserBookmarkRepository,
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
