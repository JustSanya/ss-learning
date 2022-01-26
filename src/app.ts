import Gate from "./Gate";
import CarSensor from "./CarSensor";
import { ClosedGate } from "./GateState";

const gate = new Gate(new ClosedGate());
const sensor = new CarSensor();

gate.connectCarSensor(sensor);

(window as any).gate = gate;
(window as any).sensor = sensor;
