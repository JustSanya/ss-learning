import Gate from "./Gate";
import CarSensor from "./CarSensor";
import CarSensorObserver from "./CarSensorObserver";
import GateLogger from "./GateLogger";
import { ClosedGate } from "./GateState";

const gate = new Gate(new ClosedGate(), new GateLogger());
const sensor = new CarSensor();

(window as any).gate = gate;
(window as any).sensor = sensor;
(window as any).sensor.subscribe(new CarSensorObserver((window as any).gate));
// (window as any).gate.subscribe(new GateLogger());
