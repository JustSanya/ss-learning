import CarSensor from "../src/CarSensor";
import CarSensorObserver from "../src/CarSensorObserver";
import Gate from "../src/Gate";
import GateLogger from "../src/GateLogger";
import { ClosedGate } from "../src/GateState";

jest.mock("../src/GateState");
jest.mock("../src/Gate");
jest.mock("../src/CarSensorObserver");
jest.mock("../src/GateLogger");

test("should notify about car arriving", () => {
  const carSensor = new CarSensor();
  const spy = jest.spyOn(carSensor, "notify");

  carSensor.onCarArrived();

  expect(spy).toHaveBeenCalledWith("CAR_ARRIVED");
});

test("should notify about car leaving", () => {
  const carSensor = new CarSensor();
  const spy = jest.spyOn(carSensor, "notify");

  carSensor.onCarLeft();

  expect(spy).toHaveBeenCalledWith("CAR_LEFT");
});

test("should register observers", () => {
  const carSensor = new CarSensor();

  const observer1 = new CarSensorObserver(
    new Gate(new ClosedGate(), new GateLogger())
  );
  const observer2 = new CarSensorObserver(
    new Gate(new ClosedGate(), new GateLogger())
  );

  carSensor.subscribe(observer1);
  carSensor.subscribe(observer2);

  expect(carSensor["observers"].length).toEqual(2);
});

test("should unregister observers", () => {
  const carSensor = new CarSensor();

  const observer1 = new CarSensorObserver(
    new Gate(new ClosedGate(), new GateLogger())
  );
  const observer2 = new CarSensorObserver(
    new Gate(new ClosedGate(), new GateLogger())
  );

  carSensor.subscribe(observer1);
  carSensor.subscribe(observer2);

  carSensor.unsubscribe(observer1);
  carSensor.unsubscribe(observer2);

  expect(carSensor["observers"].length).toEqual(0);
});

test("should not add same observer twice", () => {
  const carSensor = new CarSensor();

  const observer1 = new CarSensorObserver(
    new Gate(new ClosedGate(), new GateLogger())
  );

  carSensor.subscribe(observer1);
  carSensor.subscribe(observer1);

  expect(carSensor["observers"].length).toEqual(1);
});

test("sould call update on observer", () => {
  const carSensor = new CarSensor();
  const observer1 = new CarSensorObserver(
    new Gate(new ClosedGate(), new GateLogger())
  );
  const spy = jest.spyOn(observer1, "update");

  carSensor.subscribe(observer1);
  carSensor.onCarArrived();

  expect(spy).toHaveBeenCalledTimes(1);
});
