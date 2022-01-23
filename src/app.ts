import { Subject, Observer } from "./types";
class Timer {
  private DEFAULT_MS_STEP = 1000;
  protected context: GateContext | undefined;

  public interval: number | undefined = undefined;
  private remaining: number;
  private intervalTimeOut: number;

  constructor(context: GateContext, intervalTimeOut: number) {
    this.context = context;
    this.intervalTimeOut = intervalTimeOut;
    this.remaining = this.intervalTimeOut;
  }

  initialize(): void {
    this.interval = window.setInterval(() => {
      if (this.remaining > 0) {
        this.remaining -= this.DEFAULT_MS_STEP;
        console.log(`Time remaining: ${this.remaining}`);
      } else {
        this.context?.finishAction();
      }
    }, this.DEFAULT_MS_STEP);
  }

  reset(): void {
    this.remaining = this.intervalTimeOut;
    window.clearInterval(this.interval);
  }

  reverse() {
    this.remaining = this.intervalTimeOut - this.remaining;
    this.initialize();
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

class GateContext {
  public timer: Timer | undefined;
  public cachedDirection: "opening" | "closing" | null = null;
  
  private DEFAULT_MS_TIMEOUT = 10000;
  private DEFAULT_MS_AUTOCLOSED = 10000;
  private _autoCloseTimeout: number;
  private _duration: number;
  private state: GateState | undefined;

  constructor(state: GateState) {
    this.transitionTo(state);
    this._duration = this.DEFAULT_MS_TIMEOUT;
    this._autoCloseTimeout = this.DEFAULT_MS_AUTOCLOSED;
    this.timer = new Timer(this, this._duration);
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
    console.log(`Context: Transition to ${(<any>state).constructor.name}.`);
    this.state = state;
    this.state?.setContext(this);
    this.state?.connectTimer(this.timer);

    if (state instanceof OpeningGate) {
      this.cachedDirection = "opening";
    } else if (state instanceof ClosingGate) {
      this.cachedDirection = "closing";
    } else if (!(state instanceof PausedGate)) {
      this.cachedDirection = null;
    }
  }

  public toggle(): void {
    this.state?.toggle();
  }

  public finishAction(): void {
    if (this.cachedDirection === "opening") {
      this.transitionTo(new OpenedGate());
      console.log("Gate opened");
      this.timer?.reset();
    } else if (this.cachedDirection === "closing") {
      this.transitionTo(new ClosedGate());
      console.log("Gate closed");
      this.timer?.reset();
    }
  }

  public openEmergency() {
    this.state?.openEmergency();
  }
}

abstract class GateState {
  protected context: GateContext | undefined;
  protected timer: Timer | undefined;

  public setContext(context: GateContext) {
    this.context = context;
    this.initialize();
  }

  public connectTimer(timer: Timer | undefined) {
    this.timer = timer;
  }

  protected initialize() {

  }

  public abstract toggle(): void;
  public openEmergency(): void {
    console.warn("Gate is not closing right now...");
  }
}

class OpenedGate extends GateState {
  private autoCloseTimer: number | undefined;

  protected initialize(): void {
    console.log(`Gate closing in ${this.context?.autoCloseTimeout}`);
    this.autoCloseTimer = window.setTimeout(() => this.toggle(), this.context?.autoCloseTimeout);
  }

  public toggle(): void {
    console.log("start closing gates");
    window.clearTimeout(this.autoCloseTimer);
    this.context?.transitionTo(new ClosingGate());
    this.context?.timer?.initialize();
  }
}

class OpeningGate extends GateState {
  public toggle(): void {
    console.log("Paused gate");
    this.timer?.pause();
    this.context?.transitionTo(new PausedGate());
  }
}

class PausedGate extends GateState {
  public toggle(): void {
    if (this.context?.cachedDirection === "opening") {
      console.log("now closing gate");
      this.context?.transitionTo(new ClosingGate());
      this.timer?.reverse();
    } else if (this.context?.cachedDirection === "closing") {
      console.log("now opening gate");
      this.context?.transitionTo(new OpeningGate());
      this.timer?.reverse();
    }
  }
}

class ClosingGate extends GateState {
  public toggle(): void {
    console.log("Paused gate");
    this.timer?.pause();
    this.context?.transitionTo(new PausedGate());
  }

  public openEmergency(): void {
    this.timer?.pause();
    this.timer?.reverse();
    this.context?.transitionTo(new OpeningGate());
  }
}

class ClosedGate extends GateState {
  public toggle(): void {
    console.log("start opening gates");
    this.context?.transitionTo(new OpeningGate());
    this.context?.timer?.initialize();
  }
}

class GateSensor implements Subject {
  public isCarDetected: Boolean = false;

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
      return console.log("Subject: Nonexistent observer.");
    }

    this.observers.splice(observerIndex, 1);
  }

  public notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  public carArrived(): void {
    this.isCarDetected = true;
    this.notify();
  }
}

class GateSensorObserver implements Observer {
  protected context: GateContext;

  constructor(context: GateContext) {
    this.context = context;
  }

  public update(sensor: GateSensor): void {
    if (sensor.isCarDetected) {
      this.context.openEmergency();
    }
  }
}

(window as any).gate = new GateContext(new ClosedGate());
(window as any).sensor = new GateSensor();

(window as any).sensor.attach(new GateSensorObserver((window as any).gate));
