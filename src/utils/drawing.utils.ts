import { Coordinate } from "../types/window-state.types";

export const drawCenterCircle = (
  ctx: CanvasRenderingContext2D,
  center: Coordinate
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
  originCenter: Coordinate,
  targetRelativeCenter: Coordinate
) => {
  ctx.strokeStyle = "#ff0000";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(originCenter.x, originCenter.y);
  ctx.lineTo(targetRelativeCenter.x, targetRelativeCenter.y);
  ctx.stroke();
  ctx.closePath();
};
