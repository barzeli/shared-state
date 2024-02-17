import { WindowState } from "./types/window-state.types";
import { SyncCallback, WorkerMessage } from "./types/worker.types";

export class WorkerHandler {
  syncCallback: SyncCallback;
  worker: SharedWorker;

  constructor(id: string, windowState: WindowState) {
    this.worker = new SharedWorker(new URL("worker.ts", import.meta.url));

    this.worker.port.postMessage({
      action: "connected",
      payload: {
        newWindow: {
          id,
          windowState,
        },
      },
    } satisfies WorkerMessage);

    this.worker.port.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      switch (message.action) {
        case "sync":
          this.syncCallback(message.payload.allWindows);
          break;
        default:
          break;
      }
    };

    window.addEventListener("beforeunload", () =>
      this.worker.port.postMessage({
        action: "closed",
        payload: { id },
      } satisfies WorkerMessage)
    );
  }

  onWindowStateChange(id: string, newState: WindowState) {
    this.worker.port.postMessage({
      action: "stateChanged",
      payload: {
        changedWindow: {
          id,
          windowState: newState,
        },
      },
    } satisfies WorkerMessage);
  }
}
