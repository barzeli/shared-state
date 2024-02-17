import { v4 as uuid } from "uuid";

import { drawCenterCircle, drawConnectingLine } from "./utils/drawing.utils";
import {
  didWindowChange,
  getCurrentWindowState,
  getTargetCenterRelativeToOrigin,
  getWindowCenter,
  getWindowOffset,
} from "./utils/window-state.utils";
import { WorkerHandler } from "./worker-handler";
import { pairArray } from "./utils/array.utils";

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
    const windowsRelativeCenters = windows
      .filter(({ id }) => id !== windowId)
      .map(({ windowState }) =>
        getTargetCenterRelativeToOrigin(
          getWindowOffset(currentWindowState),
          getWindowOffset(windowState),
          getWindowCenter(windowState)
        )
      );

    windowsRelativeCenters.forEach((targetCenterRelativeToOrigin) => {
      drawCenterCircle(ctx, targetCenterRelativeToOrigin);
      drawConnectingLine(
        ctx,
        getWindowCenter(currentWindowState),
        targetCenterRelativeToOrigin
      );
    });

    pairArray(windowsRelativeCenters).forEach(([originCenter, targetCenter]) =>
      drawConnectingLine(ctx, originCenter, targetCenter)
    );
  };

  setInterval(() => {
    const newState = getCurrentWindowState();
    const windowChanged = didWindowChange(currentWindowState, newState);
    if (windowChanged.offsetChanged || windowChanged.sizeChanged) {
      if (windowChanged.sizeChanged) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      currentWindowState = newState;
      workerHandler.onWindowStateChange(windowId, newState);
    }
  }, 10);
};

main();
