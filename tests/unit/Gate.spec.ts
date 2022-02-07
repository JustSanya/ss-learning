import Gate from "../../src/logic/Gate";
import GateLogger from "../../src/logic/GateLogger";
import { ClosedGate, OpenedGate } from "../../src/logic/GateState";
jest.mock("../../src/logic/GateState");
jest.mock("../../src/logic/GateLogger");

test("should set context for gate state", () => {
  const state = new ClosedGate();
  const newState = new OpenedGate();
  const gate = new Gate(state, new GateLogger());

  gate.transitionTo(newState);

  expect(newState.setGate).toBeCalledWith(gate);
});

test("should toggle state", () => {
  const state = new ClosedGate();
  const gate = new Gate(state, new GateLogger());

  gate.toggle();

  expect(state.toggle).toHaveBeenCalledTimes(1);
});

test("should notify state on car arrived", () => {
  const state = new ClosedGate();
  const gate = new Gate(state, new GateLogger());

  gate.onCarArrived();

  expect(state.onCarArrived).toHaveBeenCalledTimes(1);
});

test("should notify state on car left", () => {
  const state = new ClosedGate();
  const gate = new Gate(state, new GateLogger());

  gate.onCarLeft();

  expect(state.onCarLeft).toHaveBeenCalledTimes(1);
});
