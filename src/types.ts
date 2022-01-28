export interface Observer {
  update(eventType: string, data: any): void;
}

export interface Subject {
  subscribe(observer: Observer): void;
  ubsubscribe(observer: Observer): void;
  notify(): void;
}

export enum gateEvents {
  GATE_CLOSED = "GATE_CLOSED",
  GATE_OPENED = "GATE_OPENED",
  GATE_CLOSING = "GATE_CLOSING",
  GATE_OPENING = "GATE_OPENING",
  GATE_PAUSED = "GATE_PAUSED",
}

export const messageMap = {
  [gateEvents.GATE_CLOSED]: "Gate has been closed",
  [gateEvents.GATE_OPENED]: "Gate has been opened",
  [gateEvents.GATE_CLOSING]: "Gate started closing",
  [gateEvents.GATE_OPENING]: "Gate started opening",
  [gateEvents.GATE_PAUSED]: "Gate has been put on hold",
};
