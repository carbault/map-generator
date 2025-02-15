import { createNoise2D, NoiseFunction2D } from "simplex-noise";
import { Map, MapType, Point, Settings, Size } from "../types";
import * as d3 from "d3";
import { lerp, mapToInterval } from "../util/math";
import { JITTER, SHAPING_FUNCTIONS } from "../constants";
import { drawMapOnCanvas } from "./drawMap";

export function buildMap(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  settings: Settings,
  seed: number
) {
  const { points, scale } = getPointsAndScale(canvas, settings);
  const delaunay = d3.Delaunay.from(
    points,
    (p) => p.x,
    (p) => p.y
  );

  const elevationNoise = createNoise2D(() => seed);

  const map: Map = {
    regions: points.map((point, index) => ({
      point,
      index,
      elevation: getElevation(point, scale, settings, elevationNoise),
      moisture: 0,
    })),
    delaunay,
    triangleCount: delaunay.halfedges.length / 3,
    voronoi: delaunay.voronoi([0, 0, canvas.width, canvas.height]),
    scale,
  };

  drawMapOnCanvas(
    map,
    ctx,
    { height: canvas.height, width: canvas.width },
    settings
  );
}

function getPointsAndScale(
  canvas: HTMLCanvasElement,
  settings: Settings
): { points: Point[]; scale: Size } {
  const points: Point[] = [];
  const scale = {
    width: (canvas.width / settings.grid.width) * window.devicePixelRatio,
    height: (canvas.height / settings.grid.height) * window.devicePixelRatio,
  };

  for (let x = 0; x <= settings.grid.width; x++) {
    for (let y = 0; y <= settings.grid.height; y++) {
      points.push({
        x: (x + JITTER * (Math.random() - Math.random())) * scale.width,
        y: (y + JITTER * (Math.random() - Math.random())) * scale.height,
      });
    }
  }

  return { scale, points };
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
): number {
  const factor = settings.type === MapType.island ? 2 : 1;
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

  const elevation = lerp(
    baseElevation,
    1 - SHAPING_FUNCTIONS[settings.shapingFunction](nx, ny),
    settings.lerp // the higher this factor is, the closer the map will be to the specified shape
  );

  return elevation;
}

function getElevation(
  point: Point,
  scale: Size,
  settings: Settings,
  noise: NoiseFunction2D
): number {
  const baseElevation = getBaseElevation(point, scale, settings, noise);
  return shapeElevation(point, baseElevation, scale, settings);
}
