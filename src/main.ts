import { v4 as uuid } from "uuid";

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
  const windowId = uuid();
  let currentWindowState = getCurrentWindowState();

  const workerHandler = new WorkerHandler(windowId, currentWindowState);

  workerHandler.syncCallback = (windows) => {
    ctx.reset();
    drawCenterCircle(ctx, getWindowCenter(currentWindowState));
    windows
      .filter(({ id }) => id !== windowId)
      .forEach(({ windowState }) => {
        drawConnectingLine(ctx, currentWindowState, windowState);
      });
  };

  setInterval(() => {
    const newState = getCurrentWindowState();
    const windowChanged = didWindowChange(currentWindowState, newState);
    if (windowChanged.positionChanged || windowChanged.sizeChanged) {
      if (windowChanged.sizeChanged) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      currentWindowState = newState;
      workerHandler.onWindowStateChange(windowId, newState);
    }
  }, 100);
};

main();
