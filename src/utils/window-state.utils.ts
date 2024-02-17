import { Coordinates, WindowState } from "../types/window-state.types";

export const didWindowChange = (
  currentState: WindowState,
  newState: WindowState
) => {
  return (
    newState.screenX !== currentState.screenX ||
    newState.screenY !== currentState.screenY ||
    newState.width !== currentState.width ||
    newState.height !== currentState.height
  );
};

export const getTargetCenterRelativeToOrigin = ({
  currentWindowOffset,
  targetWindowOffset,
  targetCenter,
}: {
  currentWindowOffset: Coordinates;
  targetWindowOffset: Coordinates;
  targetCenter: Coordinates;
}) => {
  const targetAbsoluteCenter = {
    x: targetWindowOffset.x + targetCenter.x,
    y: targetWindowOffset.y + targetCenter.y,
  };

  const targetCenterRelativeToOrigin = {
    x: targetAbsoluteCenter.x - currentWindowOffset.x,
    y: targetAbsoluteCenter.y - currentWindowOffset.y,
  };

  return targetCenterRelativeToOrigin;
};

export const getCurrentWindowState = (): WindowState => ({
  screenX: window.screenX,
  screenY: window.screenY,
  width: window.innerWidth,
  height: window.innerHeight,
});

export const getWindowCenter = (windowState: WindowState): Coordinates => ({
  x: windowState.width / 2,
  y: windowState.height / 2,
});
