import Timer from "./Timer";
import GateState from "./GateState";
import CarSensor from "./CarSensor";

export default class Gate {
  public timer: Timer | undefined;

  private DEFAULT_MS_TIMEOUT = 10000;
  private DEFAULT_MS_AUTOCLOSED = 10000;
  private _autoCloseTimeout: number;
  private _duration: number;
  private state: GateState | undefined;

  constructor(state: GateState) {
    this.transitionTo(state);
    this._duration = this.DEFAULT_MS_TIMEOUT;
    this._autoCloseTimeout = this.DEFAULT_MS_AUTOCLOSED;
    this.timer = new Timer(this._duration);
  }

  public connectCarSensor(carSensor: CarSensor): void {
    carSensor.subscribe("carArrived", this.onCarArrived, this);
    carSensor.subscribe("carLeft", this.onCarLeft, this);
  }

  public set autoCloseTimeout(autoCloseTimeout: number) {
    this._autoCloseTimeout = autoCloseTimeout;
  }

  public get autoCloseTimeout() {
    return this._autoCloseTimeout;
  }

  public set duration(duration: number) {
    this._duration = duration;
    this.timer?.configureInterval(this._duration);
  }

  public get duration() {
    return this._duration;
  }
  
  public configureDuration(duration: number) {
    this._duration = duration;
    this.timer?.configureInterval(this._duration);
  }
  
  public transitionTo(state: GateState): void {
    console.log(
      `<------ Transition to ${(<any>state).constructor.name}. ------>`
    );
    this.state = state;
    this.state?.setGate(this);
    this.state?.connectTimer(this.timer);
  }
  
  public toggle(): void {
    this.state?.toggle();
  }

  public onCarArrived() {
    this.state?.onCarArrived();
  }

  public onCarLeft() {
    this.state?.onCarLeft();
  }
}
