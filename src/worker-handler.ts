import { v4 as uuid } from "uuid";
import { Window, WindowState } from "./types/window-state.types";
import { getCurrentWindowState } from "./utils/window-state.utils";
import { SyncCallback, WorkerMessage } from "./types/worker.types";

export class WorkerHandler {
  id = uuid();
  syncCallback: SyncCallback;
  currentWindow = getCurrentWindowState();
  worker: SharedWorker;

  constructor() {
    this.worker = new SharedWorker(new URL("worker.ts", import.meta.url));

    this.worker.port.postMessage({
      action: "connected",
      payload: {
        newWindow: {
          id: this.id,
          windowState: this.currentWindow,
        },
      },
    } satisfies WorkerMessage);

    this.worker.port.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      switch (message.action) {
        case "sync":
          this.currentWindow = getCurrentWindowState();
          this.syncCallback(message.payload.allWindows);
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

  onWindowStateChange(newState: WindowState) {
    this.worker.port.postMessage({
      action: "stateChanged",
      payload: {
        changedWindow: {
          id: this.id,
          windowState: newState,
        },
      },
    } satisfies WorkerMessage);
  }
}
