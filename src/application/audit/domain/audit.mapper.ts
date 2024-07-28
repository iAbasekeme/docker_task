import { FindOptionsWhere } from 'typeorm';
import { FindAuditDto } from '../dto/find-audit.dto';
import { AuditLog } from '../entities/audit.entity';
import { pick } from 'ramda';

export class AuditMapper {
  static auditFields: Array<keyof FindAuditDto> = [
    'operationType',
    'subjectId',
    'subjectType',
    'objectId',
    'level',
    'objectType',
    'targetId',
    'action',
    'targetApp',
    'sourceApp',
  ];
  static toDB(queryDto: FindAuditDto) {
    const query = pick(this.auditFields, queryDto);
    const dbQuery: FindOptionsWhere<AuditLog> =
      query as FindOptionsWhere<AuditLog>;
    return dbQuery;
  }
}
