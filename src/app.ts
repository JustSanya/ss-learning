enum GateState {
  CLOSED,
  CLOSING,
  OPENED,
  OPENING,
}

const DEFAULT_TIMEOUT = 10000;
const DEFAULT_STEP = 1000;

const gateStatus = document.getElementById("status") as HTMLParagraphElement;
const countdown = document.getElementById("countdown") as HTMLParagraphElement;
const toggle = document.getElementById("toggle") as HTMLButtonElement;

class Gateway {
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
        if (this.interval) {
          this.stop();
        } else {
          this.remaining = DEFAULT_TIMEOUT - this.remaining;
          this.close();
        }
        break;
      case GateState.CLOSING:
        if (this.interval) {
          this.stop();
        } else {
          this.remaining = DEFAULT_TIMEOUT - this.remaining;
          this.open();
        }
        break;
    }
  }

  open() {
    this.state = GateState.OPENING;
    gateStatus.textContent = "Opening....";

    this.interval = window.setInterval(() => {
      if (this.remaining > 0) {
        this.remaining -= DEFAULT_STEP;
        countdown.textContent = this.remaining.toString();
      } else {
        this.state = GateState.OPENED;
        gateStatus.textContent = "Opened";
        this.remaining = DEFAULT_TIMEOUT;
        window.clearInterval(this.interval);
        countdown.textContent = this.remaining.toString();
      }
    }, DEFAULT_STEP);
  }

  close() {
    this.state = GateState.CLOSING;
    gateStatus.textContent = "Closing...";

    this.interval = window.setInterval(() => {
      if (this.remaining > 0) {
        this.remaining -= DEFAULT_STEP;
        countdown.textContent = this.remaining.toString();
      } else {
        this.state = GateState.CLOSED;
        gateStatus.textContent = "Closed";
        window.clearInterval(this.interval);
        this.remaining = DEFAULT_TIMEOUT;
        countdown.textContent = this.remaining.toString();
      }
    }, DEFAULT_STEP);
  }

  stop() {
    gateStatus.textContent = "Pause";
    window.clearInterval(this.interval);
    this.interval = undefined;
  }
}

class GatewayReceiver {}

class GatewaySwitcher {}

const gateWay = new Gateway();

toggle.addEventListener(
  "click",
  () => {
    gateWay.toggle();
  },
  false
);
