import { v4 as uuid } from "uuid";
import { Window, WindowState } from "./types/window-state.types";
import { getCurrentWindowState } from "./utils/window-state.utils";
import { SyncCallback, WorkerMessage } from "./types/worker.types";

export class WorkerHandler {
  id = uuid();
  syncCallbacks: SyncCallback[] = [];
  currentWindow = getCurrentWindowState();
  worker: SharedWorker;
  windows: Window[] = [];

  constructor() {
    this.worker = new SharedWorker(new URL("worker.ts", import.meta.url));

    this.worker.port.postMessage({
      action: "connected",
      payload: {
        id: this.id,
        windowState: this.currentWindow,
      },
    } satisfies WorkerMessage);

    this.worker.port.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      switch (message.action) {
        case "sync":
          this.currentWindow = getCurrentWindowState();
          this.windows = message.payload.allWindows;
          this.syncCallbacks.forEach((syncCallback) =>
            syncCallback(this.windows)
          );
          break;
        default:
          break;
      }
    };

    window.addEventListener("beforeunload", () =>
      this.worker.port.postMessage({
        action: "closed",
        payload: { id: this.id },
      } satisfies WorkerMessage)
    );
  }

  onSync(callback: SyncCallback) {
    this.syncCallbacks.push(callback);
  }

  onWindowStateChange(newState: WindowState) {
    this.worker.port.postMessage({
      action: "stateChanged",
      payload: {
        id: this.id,
        newState,
      },
    } satisfies WorkerMessage);
  }
}
