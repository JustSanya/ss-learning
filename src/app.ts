enum GateState {
  CLOSED,
  CLOSING,
  OPENED,
  OPENING,
}

const messages = ["Closed", "Closing...", "Opened", "Opening...", "Paused"];

const DEFAULT_TIMEOUT = 10000;
const DEFAULT_STEP = 1000;

const gateStatus = document.getElementById("status") as HTMLParagraphElement;
const countdown = document.getElementById("countdown") as HTMLParagraphElement;
const toggle = document.getElementById("toggle") as HTMLButtonElement;

class Gateway {
  constructor() {
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.finishClosing = this.finishClosing.bind(this);
    this.finishOpening = this.finishOpening.bind(this);
  }

  private state: GateState = GateState.CLOSED;
  private remaining: number = DEFAULT_TIMEOUT;
  private interval: number | undefined = undefined;

  toggle() {
    switch (this.state) {
      case GateState.CLOSED:
        this.open();
        break;
      case GateState.OPENED:
        this.close();
        break;
      case GateState.OPENING:
        this.handlePendingState(this.close);
        break;
      case GateState.CLOSING:
        this.handlePendingState(this.open);
        break;
    }
  }

  open(): void {
    this.setState(GateState.OPENING);
    this.initializeTimer(this.finishOpening);
  }

  close(): void {
    this.setState(GateState.CLOSING);
    this.initializeTimer(this.finishClosing);
  }

  finishOpening() {
    this.setState(GateState.OPENED);
    this.resetTimer();
  }

  finishClosing() {
    this.setState(GateState.CLOSED);
    this.resetTimer();
  }

  proceed() {
    this.remaining -= DEFAULT_STEP;
    countdown.textContent = this.remaining.toString();
  }

  stop() {
    gateStatus.textContent = "Pause";
    window.clearInterval(this.interval);
    this.interval = undefined;
  }

  initializeTimer(callback: Function) {
    this.interval = window.setInterval(() => {
      if (this.remaining > 0) {
        this.proceed();
      } else {
        callback();
      }
    }, DEFAULT_STEP);
  }

  resetTimer() {
    this.remaining = DEFAULT_TIMEOUT;
    window.clearInterval(this.interval);
    countdown.textContent = this.remaining.toString();
  }

  setState(state: number): void {
    this.state = state;
    gateStatus.textContent = messages[state] ?? "";
  }

  handlePendingState(callback: Function) {
    if (this.interval) {
      this.stop();
    } else {
      this.remaining = DEFAULT_TIMEOUT - this.remaining;
      callback();
    }
  }
}

const gateWay = new Gateway();

toggle.addEventListener(
  "click",
  () => {
    gateWay.toggle();
  },
  false
);
