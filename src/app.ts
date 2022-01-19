class Timer {
  private DEFAULT_MS_TIMEOUT = 10000;
  private DEFAULT_MS_STEP = 1000;
  protected context: GateContext | undefined;

  public interval: number | undefined = undefined;
  private remaining: number = this.DEFAULT_MS_TIMEOUT;

  constructor(context: GateContext) {
    this.context = context;
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
    this.remaining = this.DEFAULT_MS_TIMEOUT;
    window.clearInterval(this.interval);
  }

  reverse() {
    this.remaining = this.DEFAULT_MS_TIMEOUT - this.remaining;
    this.initialize();
  }

  pause() {
    window.clearInterval(this.interval);
    this.interval = undefined;
  }
}

class GateContext {
  private state: GateState | undefined;
  public timer: Timer | undefined;
  public cachedDirection: "opening" | "closing" | null = null;

  constructor(state: GateState) {
    this.transitionTo(state);
    this.timer = new Timer(this);
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
}

abstract class GateState {
  protected context: GateContext | undefined;
  protected timer: Timer | undefined;

  public setContext(context: GateContext) {
    this.context = context;
  }

  public connectTimer(timer: Timer | undefined) {
    this.timer = timer;
  }

  public abstract toggle(): void;
}

class OpenedGate extends GateState {
  public toggle(): void {
    console.log("start closing gates");
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
}

class ClosedGate extends GateState {
  public toggle(): void {
    console.log("start opening gates");
    this.context?.transitionTo(new OpeningGate());
    this.context?.timer?.initialize();
  }
}

const gate = new GateContext(new ClosedGate());

gate.toggle();
window.setTimeout(() => {
  gate.toggle();
}, 3000);

window.setTimeout(() => {
  gate.toggle();
}, 5000);

window.setTimeout(() => {
  gate.toggle();
}, 10000);
