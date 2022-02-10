export default class Timer {
  private DEFAULT_MS_STEP = 1000;

  public interval: number | undefined = undefined;
  private remaining: number;
  private intervalTimeOut: number;

  constructor(intervalTimeOut: number) {
    this.intervalTimeOut = intervalTimeOut;
    this.remaining = this.intervalTimeOut;
  }

  initialize(finishCallback: Function, inProgressCallback: Function): void {
    this.interval = window.setInterval(() => {
      if (this.remaining > 0) {
        this.remaining -= this.DEFAULT_MS_STEP;
        inProgressCallback(this.remaining);
      } else {
        finishCallback();
      }
    }, this.DEFAULT_MS_STEP);
  }

  reset(): void {
    this.remaining = this.intervalTimeOut;
    window.clearInterval(this.interval);
  }

  reverse(): void {
    this.remaining = this.intervalTimeOut - this.remaining;
  }

  pause(): void {
    window.clearInterval(this.interval);
    this.interval = undefined;
  }

  configureInterval(intervalTimeOut: number): void {
    this.intervalTimeOut = intervalTimeOut;
    this.remaining = intervalTimeOut;
  }
}
