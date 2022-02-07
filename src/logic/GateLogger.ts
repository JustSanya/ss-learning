import { gateEvents, Observer } from "./types";

export default class GateLogger implements Observer {
  constructor(private logs: Array<string> = []) {}

  public update(_: gateEvents, data: string): void {
    console.log("GATE LOGGER: " + data);
    this.logs.push(data);
  }
}
