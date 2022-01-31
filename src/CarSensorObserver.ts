import { Observer } from "./types";

export default class CarSensorObserver implements Observer {
  protected gate: any;
  private EVENT_MAP: any = {
    CAR_ARRIVED: "onCarArrived",
    CAR_LEFT: "onCarLeft",
  };

  constructor(gate: any) {
    this.gate = gate;
  }

  public update(eventType: string): void {
    this.gate[this.EVENT_MAP[eventType]] &&
      this.gate[this.EVENT_MAP[eventType]]();
  }
}
