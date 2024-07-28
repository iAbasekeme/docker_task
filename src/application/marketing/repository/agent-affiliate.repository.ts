import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { AgentAffiliate } from '../entities/agent-affiliate.entity';
import { Hotel } from 'src/application/hotel/entities/hotel.entity';
import { BaseQueryDto } from 'src/common/dto';
import { PaginatedResult, Pagination } from 'src/lib/pagination.lib';

@Injectable()
export class AgentAffiliateRepository extends Repository<AgentAffiliate> {
  constructor(private dataSource: DataSource) {
    super(AgentAffiliate, dataSource.createEntityManager());
  }

  async findHotelsOnboarded(dto: BaseQueryDto & { agentId: string }) {
    const { page, perPage } = dto || {};
    const pagination = new Pagination(page, perPage);
    const qb = this.dataSource
      .createQueryBuilder(Hotel, 'hotel')
      .innerJoin('hotel.agentAffiliate', 'agentAffiliate')
      .where('agentAffiliate.agentId = :agentId', { agentId: dto.agentId })
      .andWhere({ approvedAt: Not(IsNull()) });

    if (dto.search) {
      qb.andWhere('LOWER("hotel"."name") ILIKE :searchTerm', {
        searchTerm: `%${dto.search.toLowerCase()}%`,
      });
    }

    qb.skip(pagination.skip)
      .take(pagination.perPage)
      .orderBy('hotel.approvedAt', 'DESC');

    const [result, total] = await qb.getManyAndCount();

    return PaginatedResult.create(result, total, pagination);
  }
}
