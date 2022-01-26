import EventManager from "./EventManager";
export default class CarSensor extends EventManager {
  public onCarArrived(): void {
    this.notify("CAR_ARRIVED");
  }

  public onCarLeft(): void {
    this.notify("CAR_LEFT");
  }
}
