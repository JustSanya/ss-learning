import EventManager from "./EventManager";

export default class CarSensor extends EventManager {
  public onCarArrived(): void {
    this.notify("carArrived");
  }

  public onCarLeft(): void {
    this.notify("carLeft");
  }
}
