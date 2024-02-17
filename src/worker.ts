import { Window } from "./types/window-state.types";
import { WorkerMessage } from "./types/worker.types";

const windows: Record<string, Window & { port: MessagePort }> = {};

onconnect = ({ ports }) => {
  const port = ports[0];

  const syncAllWindows = () => {
    Object.values(windows).forEach((window) => {
      window.port.postMessage({
        action: "sync",
        payload: {
          allWindows: Object.values(windows).map(({ id, windowState }) => ({
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
        const newWindow = message.payload.newWindow;
        windows[newWindow.id] = { ...newWindow, port };
        syncAllWindows();
        break;
      case "stateChanged":
        const { id, windowState } = message.payload.changedWindow;
        windows[id].windowState = windowState;
        syncAllWindows();
        break;
      case "closed":
        delete windows[message.payload.id];
        syncAllWindows();
        break;
      default:
        break;
    }
  };
};
