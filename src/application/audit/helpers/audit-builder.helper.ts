import { isEmpty } from 'ramda';
import { Apps } from '../../../common/types';
import { AuditPayload } from '../audit.type';
import { Person } from '../../authentication/factories/person.factory';

export class AuditBuilder {
  static init(data: AuditPayload) {
    const builder = new AuditBuilder(
      data.operationType,
      data.level,
      data.action,
    );
    builder
      .setDecription(data.description, data.subDescription)
      .setMetadata(data.metadata)
      .setObject(data.objectId, data.objectType)
      .setSourceAndTarget(data.sourceApp, {
        app: data.targetApp,
        id: data.targetId,
      })
      .setState(data.finalObjectState, data.initialObjectState)
      .setSubject(data.subjectId, data.subjectType);
    return builder;
  }
  private auditData: AuditPayload;
  private required: Array<keyof AuditPayload> = [
    'operationType',
    'subjectId',
    'subjectType',
    'description',
    'objectId',
    'objectType',
    'targetId',
    'action',
    'requestContext',
    'sourceApp',
    'targetApp',
    'level',
  ];

  constructor(
    operationType: AuditPayload['operationType'],
    level: AuditPayload['level'],
    action: AuditPayload['action'],
  ) {
    this.auditData = {
      operationType,
      level,
      action,
    } as AuditPayload;
  }

  get data() {
    return this.auditData;
  }

  setObject(objectId: string, objectType: string) {
    this.auditData.objectId = objectId;
    this.auditData.objectType = objectType;
    return this;
  }

  setRequestContext(
    payload: Array<{ type: 'query' | 'body' | 'params'; data: unknown }>,
    ipAddress: string,
    person?: Person,
  ) {
    this.auditData.requestContext = {
      payload,
      ipAddress,
      person,
    };
    return this;
  }

  setSubject(subjectId: string, subjectType: AuditPayload['subjectType']) {
    this.auditData.subjectId = subjectId || 'guest';
    this.auditData.subjectType = (subjectType || 'guest') as any;
    return this;
  }

  setDecription(description: string, subDescription?: string) {
    this.auditData.description = description;
    this.auditData.subDescription = subDescription;
    return this;
  }

  setState<F, I>(finalObjectState: F, initialObjectState: I) {
    this.auditData.initialObjectState = initialObjectState;
    this.auditData.finalObjectState = finalObjectState;
    return this;
  }

  setMetadata<M>(metadata: M) {
    this.auditData.metadata = metadata;
    return this;
  }

  setSourceAndTarget(sourceApp: Apps, target: { app: Apps; id: string }) {
    this.auditData.sourceApp = sourceApp;
    this.auditData.targetApp = target.app;
    this.auditData.targetId = target.id;
    return this;
  }

  protected validate() {
    const auditData = this.auditData;
    const requiredFields = this.required;
    const requiredButNotSupplied: Array<keyof AuditPayload> = [];
    for (let key of requiredFields) {
      if (!(key in auditData)) {
        requiredButNotSupplied.push(key);
      }
    }
    if (!isEmpty(requiredButNotSupplied)) {
      throw new Error(
        `the following fields are required ${requiredButNotSupplied.join(
          ', ',
        )}`,
      );
    }
  }

  build() {
    this.validate();
    return this.auditData;
  }
}
