import { Injectable, Logger } from '@nestjs/common';
import { pick } from 'ramda';
import { Apps } from 'src/common/types';
import { Request } from 'express';
import { AuditLogRepository } from './audit.repository';
import { AuditLog } from './entities/audit.entity';
import { FindAuditDto } from './dto/find-audit.dto';
import { PaginatedResult, Pagination } from '../../lib/pagination.lib';
import { AuditBuilder } from './helpers/audit-builder.helper';
import { AuditMapper } from './domain/audit.mapper';
import { Person } from '../authentication/factories/person.factory';
import { AuditPayload } from './audit.type';

@Injectable()
export class AuditService {
  logger = new Logger(AuditService.name);
  constructor(private auditRepository: AuditLogRepository) {}

  async create(dto: AuditLog | AuditBuilder) {
    const auditData = dto instanceof AuditBuilder ? dto.build() : dto;
    return await this.auditRepository.save(auditData);
  }

  async buildAndCreate(options: {
    operationType: string;
    action: AuditPayload['action'];
    subject: Person;
    target: { app: Apps; id: string };
    sourceApp: AuditPayload['sourceApp'];
    level: AuditPayload['level'];
    description: { primary: string; secondary?: string };
    object: { type: AuditPayload['objectType']; id: AuditPayload['objectId'] };
    state: any;
    requestContext: {
      req: Request;
      context: Array<{
        type: 'query' | 'body' | 'params';
        data: unknown;
      }>;
    };
  }) {
    try {
      const {
        operationType,
        subject,
        target,
        sourceApp,
        level,
        description,
        object,
        state,
        requestContext,
        action,
      } = options || {};
      const auditBuilder = AuditBuilder.init({
        operationType: operationType,
        subjectId: subject.id,
        subjectType: subject.role,
        targetApp: target.app,
        targetId: target.id,
        sourceApp,
        level,
        action,
      } as AuditPayload)
        .setRequestContext(
          requestContext.context,
          requestContext.req.ip,
          subject,
        )
        .setDecription(description.primary, description.secondary)
        .setState(state, null)
        .setObject(object.id, object.type);
      await this.create(auditBuilder);
    } catch (error) {
      this.logger.error('error auditing room creation', error);
    }
  }

  async find(queryDto: FindAuditDto, fieldsToReturn?: Array<keyof AuditLog>) {
    const { page, perPage } = queryDto || {};
    const pagination = new Pagination(page, perPage);
    const [result, total] = await this.auditRepository.findAndCount({
      where: AuditMapper.toDB(queryDto),
      skip: pagination.skip,
      take: pagination.perPage,
    });
    return PaginatedResult.create(
      fieldsToReturn ? result.map((r) => pick(fieldsToReturn, r)) : result,
      total,
      pagination,
    );
  }

  async resolveAuditObject() {}
}
