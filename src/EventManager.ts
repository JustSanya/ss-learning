import { Observer } from "./types";

// export default class EventManager {
//   private listeners: { [key: string]: Listener[] } = {};

//   public subscribe(eventType: string, handler: Function, context: any): void {
//     this.listeners[eventType] = this.listeners[eventType] || [];
//     this.listeners[eventType].push({ handler, context });
//   }

//   public unsubscribe(eventType: string, handler: Function, context: any): void {
//     const listenerIndex = this.listeners[eventType]?.findIndex(
//       (listener: Listener) =>
//         listener.handler === handler && listener.context === context
//     );

//     if (listenerIndex > -1) {
//       this.listeners[eventType].splice(listenerIndex, 1);
//     }
//   }

//   public notify(eventType: string, data?: any): void {
//     this.listeners[eventType]?.forEach((listener: Listener) =>
//       listener.handler.call(listener.context, data)
//     );
//   }
// }

export default class EventManager {
  private observers: Observer[] = [];

  public subscribe(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.warn("Subject: Observer has been attached already.");
    }
    this.observers.push(observer);
  }

  public ubsubscribe(observer: Observer): void {
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
