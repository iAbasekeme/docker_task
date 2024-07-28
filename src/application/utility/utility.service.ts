import { Injectable } from '@nestjs/common';
import { ListBanks } from '../gateway/bank/list-banks';
import { ResolveAccountDto } from './dto/resolver-account.dto';
import { AccountNameResolver } from '../gateway/bank/account-name-resolver.gateway';
import { FileUploadResponse } from '../gateway/cloudinary/cloudinary-response';
import { CloudinaryService } from '../gateway/cloudinary/cloudinary.service';
import { CountryRepository } from './location/country.repository';
import { StateRepository } from './location/state.repository';
import { CityRepository } from './location/city.repository';

@Injectable()
export class UtilityService {
  constructor(
    private banks: ListBanks,
    private accountNameResolver: AccountNameResolver,
    private cloudinaryService: CloudinaryService,
    private countryRepository: CountryRepository,
    private stateRepository: StateRepository,
    private cityRepository: CityRepository,
  ) {}

  listBanks() {
    return this.banks.listAll();
  }

  async resolveAccountName(dto: ResolveAccountDto) {
    const data = await this.accountNameResolver.resolve(
      dto.accountNumber,
      dto.bankSortCode,
    );
    return { success: true, message: 'account resolved', data };
  }

  async uploadFile(file: Express.Multer.File): Promise<FileUploadResponse> {
    return await this.cloudinaryService.uploadFile(file);
  }

  async findCountries() {
    return this.countryRepository.find();
  }

  async findStatesByCountryId(countryId: string) {
    return this.stateRepository.findBy([
      { countryId },
      { countryCode: countryId },
    ]);
  }

  async findCitiesByStateId(stateId: string) {
    return this.cityRepository.findBy([{ stateId }, { stateCode: stateId }]);
  }
}
