import { Window } from "./types/window-state.types";
import { WorkerMessage } from "./types/worker.types";

let windows: (Window & { port: MessagePort })[] = [];

onconnect = ({ ports }) => {
  const port = ports[0];

  const syncAllWindows = () => {
    windows.forEach((window) => {
      window.port.postMessage({
        action: "sync",
        payload: {
          allWindows: windows.map(({ id, windowState }) => ({
            id,
            windowState,
          })),
        },
      } satisfies WorkerMessage);
    });
  };

  port.onmessage = (event: MessageEvent<WorkerMessage>) => {
    const message = event.data;
    switch (message.action) {
      case "connected":
        windows.push({ ...message.payload, port });
        syncAllWindows();
        break;
      case "stateChanged":
        const { id: changedId, newState } = message.payload;
        const oldWindowIndex = windows.findIndex(({ id }) => id === changedId);
        windows[oldWindowIndex].windowState = newState;
        syncAllWindows();
        break;
      case "closed":
        windows = windows.filter((window) => window.id !== message.payload.id);
        syncAllWindows();
        break;
      default:
        break;
    }
  };
};
