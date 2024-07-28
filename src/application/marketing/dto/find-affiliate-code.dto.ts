import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from '../../../common/dto';

export class FindAffiliateCodes extends BaseQueryDto {
  @IsString()
  @IsOptional()
  agentId?: string;
}
