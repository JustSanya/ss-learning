import { Listener } from "./types";

export default class EventManager {
  private listeners: { [key: string]: Listener[] } = {};

  public subscribe(eventType: string, handler: Function, context: any): void {
    this.listeners[eventType] = this.listeners[eventType] || [];
    this.listeners[eventType].push({ handler, context });
  }

  public unsubscribe(eventType: string, handler: Function, context: any): void {
    const listenerIndex = this.listeners[eventType]?.findIndex(
      (listener: Listener) =>
        listener.handler === handler && listener.context === context
    );

    if (listenerIndex > -1) {
      this.listeners[eventType].splice(listenerIndex, 1);
    }
  }

  public notify(eventType: string, data?: any): void {
    this.listeners[eventType]?.forEach((listener: Listener) =>
      listener.handler.call(listener.context, data)
    );
  }
}
