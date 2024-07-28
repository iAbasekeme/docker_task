import { Module } from '@nestjs/common';
import { UtilityController } from './utility.controller';
import { UtilityService } from './utility.service';
import { AccountNameResolver } from '../gateway/bank/account-name-resolver.gateway';
import { ListBanks } from '../gateway/bank/list-banks';
import { CloudinaryModule } from '../gateway/cloudinary/cloudinary.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [CloudinaryModule, LocationModule],
  controllers: [UtilityController],
  providers: [
    UtilityService,
    { provide: AccountNameResolver, useValue: new AccountNameResolver() },
    { provide: ListBanks, useValue: new ListBanks() },
  ],
})
export class UtilityModule {}
