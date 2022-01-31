import { Observer } from "./types";
export default class EventManager {
  protected observers: Observer[] = [];

  public subscribe(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.warn("Subject: Observer has been attached already.");
    }
    this.observers.push(observer);
  }

  public unsubscribe(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log("Subject: Nonexistent observer.");
    }

    this.observers.splice(observerIndex, 1);
  }

  public notify(eventType: string, data?: any): void {
    for (const observer of this.observers) {
      observer.update(eventType, data);
    }
  }
}
