import GateLogger from "../src/GateLogger";
import { messageMap, gateEvents } from "../src/types";

test("should output the correct state to the console", () => {
  const spy = jest.spyOn(global.console, 'log');

  const gateLogger = new GateLogger();

  gateLogger.update(gateEvents.GATE_CLOSED, messageMap[gateEvents.GATE_CLOSED]);

  expect(spy.mock.calls[0][0]).toBe("GATE LOGGER: Gate has been closed");  

  gateLogger.update(gateEvents.GATE_OPENING_BLOCKED, messageMap[gateEvents.GATE_OPENING_BLOCKED]);

  expect(spy.mock.calls[1][0]).toBe("GATE LOGGER: Car is detected, gate opening, wait till car leaves");
});