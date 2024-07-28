export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other',
}

export class BaseEvent<Payload> {
  constructor(protected readonly payload: Payload) {}
  public static readonly eventName: string;
}

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export type MakePropertiesRequired<T, K extends keyof T> = Pick<T, K> &
  Partial<Omit<T, K>>;

export enum Apps {
  User = 'user-app',
  Hotel = 'hotel-app',
  Admin = 'admin-app',
  Agent = 'agent-app',
}

export type Point = {
  type: 'Point';
  coordinates: [number, number];
};
