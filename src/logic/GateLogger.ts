import { gateEvents, Observer } from "./types";

export default class GateLogger implements Observer {
  public update(_: gateEvents, data?: string): void {
    console.log("GATE LOGGER: " + data);
  }
}
