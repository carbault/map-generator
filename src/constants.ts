import { MapType, Settings, ShapingFunction } from "./types";
import { euclideanSquared, squareBump } from "./util/math";

export const JITTER = 0.5;

export const DEFAULT_SETTINGS: Settings = {
  wavelength: 0.12,
  lerp: 0.5,
  grid: { width: 200, height: 100 },
  shapingFunction: ShapingFunction.euclidean,
  type: MapType.island,
};

export const SHAPING_FUNCTIONS: Record<
  ShapingFunction,
  (nx: number, ny: number) => number
> = {
  "euclidean-squared": euclideanSquared,
  "square-bump": squareBump,
};
