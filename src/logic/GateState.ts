import Timer from "./Timer";
import Gate from "./Gate";
import { gateEvents } from "./types";

export default abstract class GateState {
  protected gate: Gate | undefined;
  protected timer: Timer | undefined;

  public setGate(gate: Gate): void {
    this.gate = gate;
    this.initialize();
  }

  public connectTimer(timer: Timer | undefined): void {
    this.timer = timer;
  }

  protected initialize(): void {}

  public abstract toggle(): void;
  public abstract onCarArrived(): void;
  public abstract onCarLeft(): void;
}

export class OpenedGate extends GateState {
  private autoCloseTimer: number | undefined;

  protected initialize(): void {
    this.gate?.notify(gateEvents.GATE_OPENED);
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

  public onCarArrived(): void {
    window.clearTimeout(this.autoCloseTimer);
    this.gate?.transitionTo(new OpenedBlockedGate());
  }

  public onCarLeft(): void {}
}

export class OpeningGate extends GateState {
  protected initialize(): void {
    this.gate?.notify(gateEvents.GATE_OPENING);

    this.gate?.timer?.initialize(() => {
      this.gate?.transitionTo(new OpenedGate());
      this.timer?.reset();
    });
  }

  public toggle(): void {
    this.timer?.pause();
    this.gate?.transitionTo(new PausedOpeningGate());
  }

  public onCarArrived(): void {
    this.timer?.pause();
    this.gate?.transitionTo(new OpeningBlockedGate());
  }

  public onCarLeft(): void {}
}

export class PausedGate extends GateState {
  private autoCloseTimer: number | undefined;

  protected initialize(): void {
    this.gate?.notify(gateEvents.GATE_PAUSED);

    console.log(`Gate closing in ${this.gate?.autoCloseTimeout}`);
    this.autoCloseTimer = window.setTimeout(
      () => this.toggle(),
      this.gate?.autoCloseTimeout
    );
  }

  toggle() {
    // some logger logic
  }

  public onCarArrived(): void {}
  public onCarLeft(): void {}

  protected cancelAutoClose(): void {
    window.clearTimeout(this.autoCloseTimer);
  }
}

export class PausedOpeningGate extends PausedGate {
  public toggle(): void {
    this.cancelAutoClose();

    this.gate?.transitionTo(new ClosingGate());
    this.timer?.reverse();
  }

  public onCarArrived(): void {
    this.cancelAutoClose();
    this.gate?.transitionTo(new OpeningBlockedGate());
  }

  public onCarLeft() {}
}

export class PausedClosingGate extends PausedGate {
  public toggle(): void {
    super.cancelAutoClose();

    this.timer?.reverse();
    this.gate?.transitionTo(new OpeningGate());
  }

  public onCarArrived(): void {
    this.timer?.reverse();
    this.gate?.transitionTo(new OpeningBlockedGate());
  }

  public onCarLeft() {}
}

export class ClosingGate extends GateState {
  protected initialize(): void {
    this.gate?.notify(gateEvents.GATE_CLOSING);

    this.gate?.timer?.initialize(() => {
      this.gate?.transitionTo(new ClosedGate());
      this.timer?.reset();
    });
  }

  public toggle(): void {
    this.timer?.pause();
    this.gate?.transitionTo(new PausedClosingGate());
  }

  public onCarArrived(): void {
    this.timer?.pause();
    this.timer?.reverse();
    this.gate?.transitionTo(new OpeningBlockedGate());
  }

  public onCarLeft() {}
}

export class ClosedGate extends GateState {
  protected initialize(): void {
    this.gate?.notify(gateEvents.GATE_CLOSED);
  }

  public toggle(): void {
    this.gate?.transitionTo(new OpeningGate());
  }

  public onCarArrived(): void {
    this.gate?.transitionTo(new OpeningBlockedGate());
  }

  public onCarLeft() {}
}

export class OpenedBlockedGate extends GateState {
  protected initialize(): void {
    this.gate?.notify(gateEvents.GATE_OPENED_BLOCKED);
  }
  public toggle(): void {
    console.warn("Can't close with car detected!");
  }

  public onCarArrived(): void {}

  public onCarLeft() {
    this.gate?.transitionTo(new OpenedGate());
  }
}

export class OpeningBlockedGate extends GateState {
  protected initialize(): void {
    this.gate?.notify(gateEvents.GATE_OPENING_BLOCKED);
    this.gate?.timer?.initialize(() => {
      this.gate?.transitionTo(new OpenedBlockedGate());
      this.timer?.reset();
    });
  }

  public toggle(): void {
    console.warn("Can't close with car detected!");
  }

  public onCarArrived(): void {}

  public onCarLeft() {
    this.timer?.pause();
    this.gate?.transitionTo(new OpeningGate());
  }
}
