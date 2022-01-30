import CarSensor from "../src/CarSensor";

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
