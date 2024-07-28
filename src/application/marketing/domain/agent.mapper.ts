import { FindOptionsWhere, ILike } from 'typeorm';
import { FindAgentDto } from '../dto/find-agent.dto';
import { MarketingAgent } from '../entities/agent.entity';
import { pick } from 'ramda';

export class AgentMapper {
  static toDB(query: Partial<FindAgentDto & MarketingAgent>) {
    let dbQuery:
      | FindOptionsWhere<MarketingAgent>
      | FindOptionsWhere<MarketingAgent>[];
    const filter = pick(
      [
        'username',
        'firstName',
        'lastName',
        'email',
        'password',
        'gender',
        'dateOfBirth',
        'phoneNumberIntl',
        'isEmailVerified',
        'isPhoneNumberVerified',
        'agentAffiliates',
        'isActive',
        'shouldReceiveNotifications',
      ],
      query as MarketingAgent,
    );
    if (query.search) {
      dbQuery = [
        { ...filter, firstName: ILike(`%${query.search}%`) },
        { ...filter, lastName: ILike(`%${query.search}%`) },
        { ...filter, username: ILike(`%${query.search}%`) },
        { ...filter, email: ILike(`%${query.search}%`) },
      ];
    } else {
      dbQuery = filter;
    }
    return dbQuery;
  }
}
