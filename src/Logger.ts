import Gate from "./Gate";

// const MessageMap = {
//   [EventsList.CLOSED]: "Gate was closed",
//   [EventsList.OPENED]: "Gate was opened",
//   [EventsList.OPENING_PAUSED]: "Gate was paused while opening",
//   [EventsList.CLOSING_PAUSED]: "Gate was pasued while closing",
//   [EventsList.OPENING]: "Gate is opening",
//   [EventsList.CLOSING]: "Gate is closing",
// };
const MessageMap = {
  CLOSED: "Gate was closed",
  OPENED: "Gate was opened",
  OPENING_PAUSED: "Gate was paused while opening",
  CLOSING_PAUSED: "Gate was pasued while closing",
  OPENING: "Gate is opening",
  CLOSING: "Gate is closing",
};

export default class Logger {
  constructor(gate: Gate) {
    gate.subscribe('CLOSED', this.log, this);
  }

  log(message: string): void {
    console.log(message);
  }
}
