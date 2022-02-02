import EventManager from "../src/EventManager";
import { Observer } from "../src/types";

class MockObserver implements Observer {
  update() {
    console.log("Mock Observer: update was called;");
  }
}

class EventManagerTestable extends EventManager {
  public getObserversQuantity() {
    return this.observers.length;
  }
}

describe("event manager as a subject of observation", () => {
  it("should register observers", () => {
    const eventManager = new EventManagerTestable();
    const observer1 = new MockObserver();
    const observer2 = new MockObserver();

    eventManager.subscribe(observer1);
    eventManager.subscribe(observer2);

    expect(eventManager.getObserversQuantity()).toEqual(2);
  });

  it("should unregister observers", () => {
    const eventManager = new EventManagerTestable();
    const observer1 = new MockObserver();
    const observer2 = new MockObserver();

    eventManager.subscribe(observer1);
    eventManager.subscribe(observer2);

    eventManager.unsubscribe(observer1);
    eventManager.unsubscribe(observer2);

    expect(eventManager.getObserversQuantity()).toEqual(0);
  });

  it("should not add same observer twice", () => {
    const eventManager = new EventManagerTestable();

    const observer1 = new MockObserver();

    eventManager.subscribe(observer1);
    eventManager.subscribe(observer1);

    expect(eventManager.getObserversQuantity()).toEqual(1);
  });
});
