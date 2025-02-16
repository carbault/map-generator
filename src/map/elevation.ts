import { NoiseFunction2D } from "simplex-noise";
import { SHAPING_FUNCTIONS } from "../constants";
import { Point, Size, Settings, MapType } from "../types";
import { mapToInterval, lerp } from "../util/math";

export function getElevationAndDistanceScore(
  point: Point,
  scale: Size,
  settings: Settings,
  noise: NoiseFunction2D
): { elevation: number; distanceScore: number } {
  const baseElevation = getBaseElevation(point, scale, settings, noise);
  return shapeElevation(point, baseElevation, scale, settings);
}

function getBaseElevation(
  point: Point,
  scale: Size,
  settings: Settings,
  noise: NoiseFunction2D
): number {
  const nx = point.x / scale.width / settings.grid.width - 0.5;
  const ny = point.y / scale.height / settings.grid.height - 0.5;
  // map noise value (between -1 and 1) to 0-1 interval to get base elevation
  const baseElevation =
    (1 + noise(nx / settings.wavelength, ny / settings.wavelength)) / 2;
  return baseElevation;
}

/**
 * Shape the elevation to force areas at a distance from a certain point to
 * be water/land. If the map type is an island, that point is the middle of
 * the map. If it's a coastline, this point is the left side of the map.
 * @param point
 * @param baseElevation
 * @param scale
 * @param settings
 */
function shapeElevation(
  point: Point,
  baseElevation: number,
  scale: Size,
  settings: Settings
): { elevation: number; distanceScore: number } {
  const factor = settings.type === MapType.island ? 1 : 0.5;
  const nx = mapToInterval(
    (factor * point.x) / scale.width,
    [0, settings.grid.width],
    [-1, 1]
  );

  const ny = mapToInterval(
    (factor * point.y) / scale.height,
    [0, settings.grid.height],
    [-1, 1]
  );

  // the distance score is the distance to the middle of the map on an island,
  // or the corner on a coastline map
  const distanceScore = 1 - SHAPING_FUNCTIONS[settings.shapingFunction](nx, ny);
  const elevation = lerp(
    baseElevation,
    distanceScore,
    settings.lerp // the higher this factor is, the closer the map will be to the specified shape
  );

  return { elevation, distanceScore };
}
