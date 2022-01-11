type StateMap = {
  [key: number]: string;
};

export enum GateState {
  CLOSED,
  CLOSING,
  OPENED,
  OPENING,
  PENDING,
}

export const stateMap: StateMap = {
  [GateState.OPENED]: "opened",
  [GateState.OPENING]: "opening...",
  [GateState.PENDING]: "paused",
  [GateState.CLOSING]: "closing...",
  [GateState.CLOSED]: "closed",
};
