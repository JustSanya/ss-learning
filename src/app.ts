import { Subject, Observer } from "./types";
class Timer {
  private DEFAULT_MS_STEP = 1000;

  public interval: number | undefined = undefined;
  private remaining: number;
  private intervalTimeOut: number;

  constructor(intervalTimeOut: number) {
    this.intervalTimeOut = intervalTimeOut;
    this.remaining = this.intervalTimeOut;
  }

  initialize(callback: Function): void {
    this.interval = window.setInterval(() => {
      if (this.remaining > 0) {
        this.remaining -= this.DEFAULT_MS_STEP;
        console.log(`Time remaining: ${this.remaining}`);
      } else {
        callback();
      }
    }, this.DEFAULT_MS_STEP);
  }

  reset(): void {
    this.remaining = this.intervalTimeOut;
    window.clearInterval(this.interval);
  }

  reverse() {
    this.remaining = this.intervalTimeOut - this.remaining;
  }

  pause() {
    window.clearInterval(this.interval);
    this.interval = undefined;
  }

  configureInterval(intervalTimeOut: number) {
    this.intervalTimeOut = intervalTimeOut;
    this.remaining = intervalTimeOut;
  }
}

class Gate {
  public timer: Timer | undefined;

  private DEFAULT_MS_TIMEOUT = 10000;
  private DEFAULT_MS_AUTOCLOSED = 10000;
  private _autoCloseTimeout: number;
  private _duration: number;
  private _blocked: boolean = false;
  private state: GateState | undefined;

  constructor(state: GateState) {
    this.transitionTo(state);
    this._duration = this.DEFAULT_MS_TIMEOUT;
    this._autoCloseTimeout = this.DEFAULT_MS_AUTOCLOSED;
    this.timer = new Timer(this._duration);
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

  public get blocked() {
    return this._blocked;
  }

  public set blocked(value) {
    this._blocked = value;
    if (value && this.state instanceof ClosingGate) {
      this.transitionTo(new BlockedOpeningGate());
    }
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
    this.state?.setgate(this);
    this.state?.connectTimer(this.timer);
  }

  public toggle(): void {
    this.state?.toggle();
  }

  public openImmediately() {
    this.state?.openImmediately();
  }
}

abstract class GateState {
  protected gate: Gate | undefined;
  protected timer: Timer | undefined;

  public setgate(gate: Gate) {
    this.gate = gate;
    this.initialize();
  }

  public connectTimer(timer: Timer | undefined) {
    this.timer = timer;
  }

  protected initialize() {}

  public abstract toggle(): void;
  public openImmediately(): void {
    console.warn("Gate is not closing right now...");
  }
}

class OpenedGate extends GateState {
  private autoCloseTimer: number | undefined;

  protected initialize(): void {
    console.log(`Gate closing in ${this.gate?.autoCloseTimeout}`);
    this.autoCloseTimer = window.setTimeout(
      () => this.toggle(),
      this.gate?.autoCloseTimeout
    );
  }

  public toggle(): void {
    window.clearTimeout(this.autoCloseTimer);
    this.gate?.transitionTo(new ClosingGate());
  }
}

class OpeningGate extends GateState {
  protected initialize(): void {
    this.gate?.timer?.initialize(() => {
      this.gate?.transitionTo(new OpenedGate());
      this.timer?.reset();
    });
  }

  public toggle(): void {
    this.timer?.pause();
    this.gate?.transitionTo(new PausedOpeningGate());
  }
}

class PausedGate extends GateState {
  private autoCloseTimer: number | undefined;

  protected initialize(): void {
    console.log(`Gate closing in ${this.gate?.autoCloseTimeout}`);
    this.autoCloseTimer = window.setTimeout(
      () => this.toggle(),
      this.gate?.autoCloseTimeout
    );
  }

  toggle() {
    // some logger logic
  }

  protected beforeToggle(): void {
    window.clearTimeout(this.autoCloseTimer);
  }
}

class PausedOpeningGate extends PausedGate {
  public toggle(): void {
    super.beforeToggle();

    this.gate?.transitionTo(new ClosingGate());
    this.timer?.reverse();
  }
}
class PausedClosingGate extends PausedGate {
  public toggle(): void {
    super.beforeToggle();

    this.gate?.transitionTo(new OpeningGate());
    this.timer?.reverse();
  }
}

class ClosingGate extends GateState {
  protected initialize(): void {
    if (this.gate?.blocked) {
      return this.openImmediately();
    }

    this.gate?.timer?.initialize(() => {
      this.gate?.transitionTo(new ClosedGate());
      this.timer?.reset();
    });
  }

  public toggle(): void {
    this.timer?.pause();
    this.gate?.transitionTo(new PausedClosingGate());
  }

  public openImmediately(): void {
    this.timer?.pause();
    this.timer?.reverse();
    this.gate?.transitionTo(new OpeningGate());
  }
}

class ClosedGate extends GateState {
  public toggle(): void {
    this.gate?.transitionTo(new OpeningGate());
  }
}

class BlockedOpeningGate extends OpeningGate {
  toggle(): void {
    console.warn("Can't close with car detected!");
  }
}

class GateSensor implements Subject {
  public isCarDetected: boolean = false;

  private observers: Observer[] = [];

  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.warn("Subject: Observer has been attached already.");
    }
    this.observers.push(observer);
  }

  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.warn("Subject: Nonexistent observer.");
    }

    this.observers.splice(observerIndex, 1);
  }

  public notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  public onCarArrived(): void {
    this.isCarDetected = true;
    this.notify();
  }

  public onCarLeft(): void {
    this.isCarDetected = false;
    this.notify();
  }
}

class GateSensorObserver implements Observer {
  protected gate: Gate;

  constructor(gate: Gate) {
    this.gate = gate;
  }

  public update(sensor: GateSensor): void {
    this.gate.blocked = sensor.isCarDetected;
  }
}

(window as any).gate = new Gate(new ClosedGate());
(window as any).sensor = new GateSensor();

(window as any).sensor.attach(new GateSensorObserver((window as any).gate));
