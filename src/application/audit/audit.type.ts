import { Apps } from '../../common/types';
import { Role } from '../access-control/access-control.constant';

export type AuditPayload = {
  operationType: OperationType;
  /**
   * Id of the agent initating the action
   */
  subjectId: string;
  /**
   * Type of agent initating the action
   */
  subjectType: Role;
  description: string;
  subDescription: string
  /**
   * Type of primary entity receiving the action
   */
  objectType: string;
  /**
   * Id of primary entity receiving the action
   */
  objectId: string;
  /**
   * Actions would sometimes cause a change of state. This is used to capture the initial state
   */
  initialObjectState?: unknown;
  /**
   * Actions would sometimes cause a change of state. This is used to capture the final state
   */
  finalObjectState?: unknown;
  action: 'create' | 'update' | 'delete' | 'read';
  /**
   * What set of users needs to see the audit
   */
  targetApp: Apps;
  /**
   * Partition of users within a set that need to see the audits
   */
  targetId?: string;
  /**
   * App where action was initiated
   */
  sourceApp: Apps;
  metadata?: any;
  level: 'low' | 'medium' | 'high';
  requestContext: unknown
};

export type OperationType =
  | 'user-creation'
  | 'hotel-creation'
  | 'hotel-update'
  | 'new-booking'
  | 'room-creation'
  | 'room-category-creation'
  | 'bank-account-creation'
  | 'agent-creation'
  | 'hotel-staff-creation';
