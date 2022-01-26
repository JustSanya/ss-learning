import Timer from "./Timer";
import GateState from "./GateState";
import CarSensor from "./CarSensor";
// import EventManager from "./EventManager";

// enum EventsList {
//   CLOSED = "GATE_CLOSED",
//   OPENED = "GATE_OPENED",
//   OPENING_PAUSED = "GATE_OPENING_PAUSED",
//   CLOSING_PAUSED = "GATE_CLOSING_PAUSED",
//   OPENING = "GATE_OPENING",
//   CLOSING = "GATE_CLOSING",
// }

// const MessageMap = {
//   [EventsList.CLOSED]: "Gate was closed",
//   [EventsList.OPENED]: "Gate was opened",
//   [EventsList.OPENING_PAUSED]: "Gate was paused while opening",
//   [EventsList.CLOSING_PAUSED]: "Gate was pasued while closing",
//   [EventsList.OPENING]: "Gate is opening",
//   [EventsList.CLOSING]: "Gate is closing",
// };

export default class Gate {
  public timer: Timer | undefined;

  private DEFAULT_MS_TIMEOUT = 10000;
  private DEFAULT_MS_AUTOCLOSED = 10000;
  private _autoCloseTimeout: number;
  private _duration: number;
  private state: GateState | undefined;
  // private eventManager: EventManager = new EventManager();
  // private events: EventsList;

  constructor(state: GateState) {
    this.transitionTo(state);
    this._duration = this.DEFAULT_MS_TIMEOUT;
    this._autoCloseTimeout = this.DEFAULT_MS_AUTOCLOSED;
    this.timer = new Timer(this._duration);
    // this.eventManager.registerAllEvents(this.events);
  }

  // public subscribe(events: EventsList[]) {
  //   this.eventManager.subscribe(events);
  // }

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

  public configureDuration(duration: number): void {
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

  public onCarArrived(): void {
    this.state?.onCarArrived();
  }

  public onCarLeft(): void {
    this.state?.onCarLeft();
  }
}

// export class CarSensorObserver {
//   protected gate: Gate;

//   constructor(gate: Gate) {
//     this.gate = gate;
//   }

//   public update(sensor: GateSensor): void {
//     this.gate.blocked = sensor.isCarDetected;
//   }
// }
