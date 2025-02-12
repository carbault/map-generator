import { Settings } from "./types";

export const JITTER = 0.5;

export const DEFAULT_SETTINGS: Settings = {
  wavelength: 0.12,
  lerp: 0.5,
  grid: { width: 200, height: 100 },
  shapingFunction: "bump-square",
};
