import { Window, WindowState } from "./window-state.types";

type Message<Action extends string, Payload extends unknown> = {
  action: Action;
  payload: Payload;
};

export type WorkerMessage =
  | Message<"connected", { id: string; windowState: WindowState }>
  | Message<"sync", { allWindows: Window[] }>
  | Message<"closed", { id: string }>
  | Message<"stateChanged", { id: string; newState: WindowState }>;

export type SyncCallback = (allWindows: Window[]) => void;
