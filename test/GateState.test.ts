import {
  OpenedGate,
  OpeningGate,
  ClosedGate,
  ClosingGate,
  OpenedBlockedGate,
  OpeningBlockedGate,
  PausedOpeningGate,
  PausedClosingGate,
} from "../src/GateState";

import Gate from "../src/Gate";
jest.mock("../src/Gate");

test("should switch OpenedGate to ClosingGate on toggle", () => {
  const state = new OpenedGate();
  const gate = new Gate(state);

  state.setGate(gate);
  state.toggle();

  expect(gate.transitionTo).toBeCalledWith(expect.any(ClosingGate));
});

test("should switch OpenedGate to OpenedBlockedGate on car arrived", () => {
  const state = new OpenedGate();
  const gate = new Gate(state);

  state.setGate(gate);
  state.onCarArrived();

  expect(gate.transitionTo).toBeCalledWith(expect.any(OpenedBlockedGate));
});

test("should switch OpeningGate to PausedOpeningGate on toggle", () => {
  const state = new OpeningGate();
  const gate = new Gate(state);
  
  state.setGate(gate);
  state.toggle();
  
  expect(gate.transitionTo).toBeCalledWith(expect.any(PausedOpeningGate));
});

test("should switch OpenedGate to OpeningBlockedGate on car arrived", () => {
  const state = new OpeningGate();
  const gate = new Gate(state);

  state.setGate(gate);
  state.onCarArrived();

  expect(gate.transitionTo).toBeCalledWith(expect.any(OpeningBlockedGate));
});

test("should switch PausedOpeningGate to ClosingGate on toggle", () => {
  const state = new PausedOpeningGate();
  const gate = new Gate(state);
  
  state.setGate(gate);
  state.toggle();
  
  expect(gate.transitionTo).toBeCalledWith(expect.any(ClosingGate));
});

test("should switch PausedOpeningGate to OpeningBlockedGate on car arrived", () => {
  const state = new PausedOpeningGate();
  const gate = new Gate(state);

  state.setGate(gate);
  state.onCarArrived();

  expect(gate.transitionTo).toBeCalledWith(expect.any(OpeningBlockedGate));
});

test("should switch PausedClosingGate to OpeningGate on toggle", () => {
  const state = new PausedClosingGate();
  const gate = new Gate(state);
  
  state.setGate(gate);
  state.toggle();
  
  expect(gate.transitionTo).toBeCalledWith(expect.any(OpeningGate));
});

test("should switch PausedClosingGate to OpeningBlockedGate on car arrived", () => {
  const state = new PausedClosingGate();
  const gate = new Gate(state);

  state.setGate(gate);
  state.onCarArrived();

  expect(gate.transitionTo).toBeCalledWith(expect.any(OpeningBlockedGate));
});

test("should switch ClosingGate to PausedClosingGate on toggle", () => {
  const state = new ClosingGate();
  const gate = new Gate(state);
  
  state.setGate(gate);
  state.toggle();
  
  expect(gate.transitionTo).toBeCalledWith(expect.any(PausedClosingGate));
});

test("should switch ClosingGate to OpeningBlockedGate on car arrived", () => {
  const state = new ClosingGate();
  const gate = new Gate(state);

  state.setGate(gate);
  state.onCarArrived();

  expect(gate.transitionTo).toBeCalledWith(expect.any(OpeningBlockedGate));
});

test("should switch ClosedGate to OpeningGate on toggle", () => {
  const state = new ClosedGate();
  const gate = new Gate(state);
  
  state.setGate(gate);
  state.toggle();
  
  expect(gate.transitionTo).toBeCalledWith(expect.any(OpeningGate));
});

test("should switch ClosedGate to OpeningBlockedGate on car arrived", () => {
  const state = new ClosedGate();
  const gate = new Gate(state);

  state.setGate(gate);
  state.onCarArrived();

  expect(gate.transitionTo).toBeCalledWith(expect.any(OpeningBlockedGate));
});

test("should NOT switch OpenedBlockedGate on toggle", () => {
  const state = new OpenedBlockedGate();
  const gate = new Gate(state);
  
  state.setGate(gate);
  state.toggle();
  
  expect(gate.transitionTo).toHaveBeenCalledTimes(0);
});

test("should switch OpenedBlockedGate to OpenedGate on car left", () => {
  const state = new OpenedBlockedGate();
  const gate = new Gate(state);

  state.setGate(gate);
  state.onCarLeft();

  expect(gate.transitionTo).toBeCalledWith(expect.any(OpenedGate));
});

test("should NOT switch OpeningBlockedGate on toggle", () => {
  const state = new OpeningBlockedGate();
  const gate = new Gate(state);
  
  state.setGate(gate);
  state.toggle();
  
  expect(gate.transitionTo).toHaveBeenCalledTimes(0);
});

test("should switch OpeningBlockedGate to OpeningGate on car left", () => {
  const state = new OpeningBlockedGate();
  const gate = new Gate(state);

  state.setGate(gate);
  state.onCarLeft();

  expect(gate.transitionTo).toBeCalledWith(expect.any(OpeningGate));
});
