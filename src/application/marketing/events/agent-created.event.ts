import { BaseEvent } from '../../../common/types';
import { MarketingAgent } from '../entities/agent.entity';

export class AgentCreatedEvent extends BaseEvent<AgentCreatedEventPayload> {
  public static readonly eventName: string = 'marketing-agent.created';
  get agent() {
    return this.payload;
  }
}

export type AgentCreatedEventPayload = MarketingAgent;
