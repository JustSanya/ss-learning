import Gate from "./Gate";
import CarSensor from "./CarSensor";
import CarSensorObserver from "./CarSensorObserver";
import GateLogger from "./GateLogger";
import { ClosedGate } from "./GateState";

export default class GateSystem {
  public gate: Gate;
  public sensor: CarSensor;
  public logs: Array<string> = [];

  constructor() {
    this.gate = new Gate(new ClosedGate(), new GateLogger(this.logs));
    this.sensor = new CarSensor();
    this.sensor.subscribe(new CarSensorObserver(this.gate));
  }
}
