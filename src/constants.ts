import { MapType, Settings, ShapingFunction } from "./types";
import {
  euclideanSquared,
  squareBump,
  squircle,
  distanceSquared,
} from "./util/math";

export const JITTER = 0.5;

export const DEFAULT_SETTINGS: Settings = {
  wavelength: 0.12,
  lerp: 0.5,
  seaLevel: 0.5,
  rainFall: 10,
  grid: { width: 100, height: 200 },
  shapingFunction: ShapingFunction.squareBump,
  type: MapType.island,
};

export const SHAPING_FUNCTIONS: Record<
  ShapingFunction,
  (nx: number, ny: number) => number
> = {
  "euclidean-squared": euclideanSquared,
  "distance-squared": distanceSquared,
  "square-bump": squareBump,
  squircle: squircle,
};
