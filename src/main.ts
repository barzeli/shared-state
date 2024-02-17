import { drawCenterCircle, drawConnectingLine } from "./utils/drawing.utils";
import {
  didWindowChange,
  getCurrentWindowState,
  getWindowCenter,
} from "./utils/window-state.utils";
import { WorkerHandler } from "./worker-handler";

const main = () => {
  const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d")!;

  const workerHandler = new WorkerHandler();

  workerHandler.syncCallback = (windows) => {
    ctx.reset();
    drawCenterCircle(ctx, getWindowCenter(workerHandler.currentWindow));
    windows
      .filter(({ id }) => id !== workerHandler.id)
      .forEach(({ windowState }) => {
        drawConnectingLine(ctx, workerHandler.currentWindow, windowState);
      });
  };

  setInterval(() => {
    const newState = getCurrentWindowState();
    if (didWindowChange(workerHandler.currentWindow, newState)) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      workerHandler.currentWindow = newState;
      workerHandler.onWindowStateChange(newState);
    }
  }, 100);
};

main();
