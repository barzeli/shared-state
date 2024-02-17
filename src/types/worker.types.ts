import { Window } from "./window-state.types";

type Message<Action extends string, Payload extends unknown> = {
  action: Action;
  payload: Payload;
};

export type WorkerMessage =
  | Message<"connected", { newWindow: Window }>
  | Message<"stateChanged", { changedWindow: Window }>
  | Message<"sync", { allWindows: Window[] }>
  | Message<"closed", { id: string }>;

export type SyncCallback = (allWindows: Window[]) => void;
