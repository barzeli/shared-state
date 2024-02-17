export type Coordinates = {
  x: number;
  y: number;
};

export type WindowState = {
  screenX: number;
  screenY: number;
  width: number;
  height: number;
};

export type Window = {
  id: string;
  windowState: WindowState;
};
