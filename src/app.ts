// import { GateState, stateMap } from "./types";

// const gateStatusIndicator = document.getElementById(
//   "status"
// ) as HTMLParagraphElement;
const countdown = document.getElementById("countdown") as HTMLParagraphElement;
// const toggle = document.getElementById("toggle") as HTMLButtonElement;

// class SignalReceiver {
//   private gatewayController = new GatewayController();

//   callController() {
//     this.gatewayController.toggle();
//   }
// }

// class GatewayController {
//   private gate: Gate = new Gate();

//   toggle(): void {
//     switch (this.gate.currentState) {
//       case GateState.CLOSED:
//         this.gate.open();
//         break;
//       case GateState.OPENED:
//         this.gate.close();
//         break;
//       case GateState.OPENING:
//       case GateState.CLOSING:
//         this.gate.pause();
//         break;
//       case GateState.PENDING:
//         this.gate.reverseAction();
//         break;
//     }
//   }
// }

// class Gate {
//   constructor() {
//     this.finishAction = this.finishAction.bind(this);
//   }

//   currentState: GateState = GateState.CLOSED;
//   private timer = new Timer();
//   private cachedState: GateState | null = null;

//   open(): void {
//     this.setState(GateState.OPENING);
//     this.timer.initialize(this.finishAction, GateState.OPENED);
//   }

//   close(): void {
//     this.setState(GateState.CLOSING);
//     this.timer.initialize(this.finishAction, GateState.CLOSED);
//   }

//   finishAction(state: GateState): void {
//     this.setState(state);
//     this.timer.reset();
//   }

//   pause(): void {
//     this.cachedState = this.currentState;
//     this.setState(GateState.PENDING);
//     this.timer.pause();
//   }

//   reverseAction(): void {
//     this.timer.reverse();
//     this.cachedState === GateState.OPENING ? this.close() : this.open();
//     this.cachedState = null;
//   }

//   setState(state: number): void {
//     this.currentState = state;
//     gateStatusIndicator.textContent = stateMap[state];
//   }
// }

class Timer {
  private DEFAULT_MS_TIMEOUT = 10000;
  private DEFAULT_MS_STEP = 1000;

  interval: number | undefined = undefined;
  private remaining: number = this.DEFAULT_MS_TIMEOUT;

  initialize(callback: Function, state: GateState): void {
    this.interval = window.setInterval(() => {
      if (this.remaining > 0) {
        this.remaining -= this.DEFAULT_MS_STEP;
        countdown.textContent = (this.remaining / 1000).toString();
      } else {
        callback(state);
      }
    }, this.DEFAULT_MS_STEP);
  }

  reset(): void {
    this.remaining = this.DEFAULT_MS_TIMEOUT;
    window.clearInterval(this.interval);
    countdown.textContent = (this.remaining / 1000).toString();
  }

  reverse() {
    this.remaining = this.DEFAULT_MS_TIMEOUT - this.remaining;
  }

  pause() {
    window.clearInterval(this.interval);
    this.interval = undefined;
  }
}

// const signalReceiver = new SignalReceiver();

// toggle.addEventListener(
//   "click",
//   () => {
//     signalReceiver.callController();
//   },
//   false
// );

class GateContext {
  private state: GateState | undefined;
  private timer: Timer = new Timer();
  public cachedDirection: "opening" | "closing" | null = null;

  constructor(state: GateState) {
    this.transitionTo(state);
  }

  public transitionTo(state: GateState): void {
    console.log(`Context: Transition to ${(<any>state).constructor.name}.`);
    this.state = state;
    this.state?.setContext(this);
    this.state?.connectTimer(this.timer);
  }

  public toggle(): void {
    this.state?.toggle();
  }
}

abstract class GateState {
  protected context: GateContext | undefined;
  protected timer: Timer | undefined;

  public setContext(context: GateContext) {
    this.context = context;
  }

  public connectTimer(timer: Timer) {
    this.timer = timer;
  }

  public abstract toggle(): void;
}

class OpenedGate extends GateState {
  public toggle(): void {
    console.log("start closing gates");
    this.context?.transitionTo(new ClosingGate());
  }
}

class OpeningGate extends GateState {
  public toggle(): void {
    console.log("Paused gate");
    this.context?.transitionTo(new PausedGate());
  }
}

class PausedGate extends GateState {
  public toggle(): void {
    if (this.context?.cachedDirection === "opening") {
      console.log("now closing gate");
      this.context?.transitionTo(new ClosingGate());
    } else if (this.context?.cachedDirection === "closing") {
      console.log("now opening gate");
      this.context?.transitionTo(new OpeningGate());
    }
  }
}

class ClosingGate extends GateState {
  public toggle(): void {
    console.log("Paused gate");
    this.context?.transitionTo(new PausedGate());
  }
}

class ClosedGate extends GateState {
  public toggle(): void {
    console.log("start opening gates");
    this.context?.transitionTo(new OpeningGate());
  }
}

const gate = new GateContext(new ClosedGate());
gate.toggle();
