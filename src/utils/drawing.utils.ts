import { Coordinates, WindowState } from "../types/window-state.types";
import {
  getTargetCenterRelativeToOrigin,
  getWindowCenter,
} from "./window-state.utils";

export const drawCenterCircle = (
  ctx: CanvasRenderingContext2D,
  center: Coordinates
) => {
  ctx.strokeStyle = "#eeeeee";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(center.x, center.y, 100, 0, Math.PI * 2, false);
  ctx.stroke();
  ctx.closePath();
};

export const drawConnectingLine = (
  ctx: CanvasRenderingContext2D,
  currentWindowState: WindowState,
  targetWindowState: WindowState
) => {
  const originCenter = getWindowCenter(currentWindowState);
  const targetCenter = getWindowCenter(targetWindowState);

  const currentWindowOffset: Coordinates = {
    x: currentWindowState.screenX,
    y: currentWindowState.screenY,
  };

  const targetWindowOffset: Coordinates = {
    x: targetWindowState.screenX,
    y: targetWindowState.screenY,
  };

  const targetCenterRelativeToOrigin = getTargetCenterRelativeToOrigin({
    currentWindowOffset,
    targetWindowOffset,
    targetCenter,
  });

  ctx.strokeStyle = "#ff0000";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(originCenter.x, originCenter.y);
  ctx.lineTo(targetCenterRelativeToOrigin.x, targetCenterRelativeToOrigin.y);
  ctx.stroke();
  ctx.closePath();
};
