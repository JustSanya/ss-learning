export type Listener = {
  handler: Function;
  context: any;
};
export interface Observer {
  update(eventType: string, data: any): void;
}

export interface Subject {
  subscribe(observer: Observer): void;
  ubsubscribe(observer: Observer): void;
  notify(): void;
}
