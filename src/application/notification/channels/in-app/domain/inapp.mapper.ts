import { FindOptionsWhere, IsNull } from 'typeorm';
import { FindInappNotificationDto } from '../dto/find-inapp.dto';
import { InAppNotification } from '../entities/in-app-notification.entity';

export class InappNotificationMapper {
  static toDB(dto: Partial<FindInappNotificationDto | InAppNotification>) {
    const dbQuery:
      | FindOptionsWhere<InAppNotification>
      | FindOptionsWhere<InAppNotification>[] = {
      readAt: IsNull(),
    };
    const queryDto = dto as InAppNotification;
    if (queryDto.personId) {
      dbQuery.personId = queryDto.personId;
    }
    if (queryDto.personType) {
      dbQuery.personType = queryDto.personType;
    }
    return dbQuery;
  }
}
