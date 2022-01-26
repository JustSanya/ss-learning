export default class Timer {
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
