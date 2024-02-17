import { Coordinate, WindowState } from "../types/window-state.types";

export const getCurrentWindowState = (): WindowState => ({
  screenX: window.screenX,
  screenY: window.screenY,
  width: window.innerWidth,
  height: window.innerHeight,
});

export const getWindowOffset = (windowState: WindowState): Coordinate => ({
  x: windowState.screenX,
  y: windowState.screenY,
});

export const getWindowCenter = (windowState: WindowState): Coordinate => ({
  x: windowState.width / 2,
  y: windowState.height / 2,
});

export const didWindowChange = (
  currentState: WindowState,
  newState: WindowState
) => ({
  offsetChanged:
    newState.screenX !== currentState.screenX ||
    newState.screenY !== currentState.screenY,
  sizeChanged:
    newState.width !== currentState.width ||
    newState.height !== currentState.height,
});

export const getTargetCenterRelativeToOrigin = (
  currentWindowOffset: Coordinate,
  targetWindowOffset: Coordinate,
  targetCenter: Coordinate
) => {
  const targetAbsoluteCenter = {
    x: targetWindowOffset.x + targetCenter.x,
    y: targetWindowOffset.y + targetCenter.y,
  };

  return {
    x: targetAbsoluteCenter.x - currentWindowOffset.x,
    y: targetAbsoluteCenter.y - currentWindowOffset.y,
  };
};
