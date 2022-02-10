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
  GATE_OPENED_BLOCKED = "GATE_OPENED_BLOCKED",
  GATE_CLOSING = "GATE_CLOSING",
  GATE_OPENING = "GATE_OPENING",
  GATE_OPENING_BLOCKED = "GATE_OPENING_BLOCKED",
  GATE_PAUSED = "GATE_PAUSED",
  TIME_REMAINING = "TIME_REMAINING",
}

export const messageMap = {
  [gateEvents.GATE_CLOSED]: "Gate has been closed",
  [gateEvents.GATE_OPENED]: "Gate has been opened",
  [gateEvents.GATE_OPENED_BLOCKED]:
    "Car is detected, gate has been opened, won't close till car leaves",
  [gateEvents.GATE_CLOSING]: "Gate started closing",
  [gateEvents.GATE_OPENING]: "Gate started opening",
  [gateEvents.GATE_OPENING_BLOCKED]:
    "Car is detected, gate opening, wait till car leaves",
  [gateEvents.GATE_PAUSED]: "Gate has been put on hold",
  [gateEvents.TIME_REMAINING]: "Time remaining: ",
};
