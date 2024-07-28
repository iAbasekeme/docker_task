import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UtilityService } from './utility.service';
import { Public } from '../authentication/decorators/public.decorator';
import { ResolveAccountDto } from './dto/resolver-account.dto';

@Controller('v1/utilities')
export class UtilityController {
  constructor(private utilityService: UtilityService) {}

  @Get('banks')
  @Public()
  listBanks() {
    return this.utilityService.listBanks();
  }

  @Get('banks/resolve')
  @Public()
  resolveAccountName(@Query() dto: ResolveAccountDto) {
    return this.utilityService.resolveAccountName(dto);
  }

  @Get('countries')
  @Public()
  findCountries() {
    return this.utilityService.findCountries();
  }

  @Get('countries/:countryId/states')
  @Public()
  findStates(@Param('countryId') countryId: string) {
    return this.utilityService.findStatesByCountryId(countryId);
  }

  @Get('states/:stateId/cities')
  @Public()
  findCities(@Param('stateId') stateId: string) {
    return this.utilityService.findCitiesByStateId(stateId);
  }

  @Post('files')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      return await this.utilityService.uploadFile(file);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'File upload failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
