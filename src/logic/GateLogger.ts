import { gateEvents, messageMap, Observer } from "./types";

export default class GateLogger implements Observer {
  constructor(private logs: Array<string> = []) {}

  public update(eventType: gateEvents, data?: any): void {
    if (data || data === 0) {
      this.logs.push(messageMap[eventType] + data);
    } else {
      this.logs.push(messageMap[eventType]);
    }
  }
}
