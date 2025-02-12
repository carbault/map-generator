import { createNoise2D, NoiseFunction2D } from "simplex-noise";
import { Map, Point, Settings, Size } from "./types";
import * as d3 from "d3";
import { euclideanSquared, lerp, squareBump } from "./util/math";
import { JITTER } from "./constants";

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
    regions: points.map((point) => ({
      point,
      elevation: getElevation(point, scale, settings, elevationNoise),
      moisture: 0,
    })),
    delaunay,
    triangleCount: delaunay.halfedges.length / 3,
    voronoi: delaunay.voronoi([0, 0, canvas.width, canvas.height]),
    scale,
  };

  drawMapOnCanvas(map, ctx, {
    height: canvas.height,
    width: canvas.width,
  });
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
  const baseElevation =
    (1 + noise(nx / settings.wavelength, ny / settings.wavelength)) / 2;

  console.log({ nx, ny, baseElevation });
  return baseElevation;
}

function shapeElevation(
  point: Point,
  baseElevation: number,
  scale: Size,
  settings: Settings
): number {
  const nx = (2 * point.x) / scale.width / (settings.grid.width - 1);
  const ny = (2 * point.y) / scale.height / (settings.grid.height - 1);
  const distance =
    settings.shapingFunction === "bump-square"
      ? squareBump(nx, ny)
      : euclideanSquared(nx, ny);
  const elevation = lerp(baseElevation, 1 - distance, settings.lerp);

  console.log({ nx, ny, baseElevation, d: distance, elevation });
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

function getElevationColor(elevation: number): string {
  if (elevation < 0.3) return "#062337";
  if (elevation < 0.35) return "#072F4B";
  if (elevation < 0.4) return "#093A5D";
  if (elevation < 0.5) return "#0B466F";
  if (elevation < 0.6) return "#b0cea1";
  if (elevation < 0.7) return "#9CC18A";
  if (elevation < 0.8) return "#8EB979";
  if (elevation < 0.85) return "#83B26C";
  if (elevation < 0.9) return "#79AB5F";
  if (elevation < 0.95) return "#6EA054";
  return "#F0EEE1";
}

function drawMapOnCanvas(
  map: Map,
  ctx: CanvasRenderingContext2D,
  canvasSize: Size
) {
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  ctx.lineWidth = 1;

  // draw map regions
  map.regions.forEach((region, index) => {
    ctx.beginPath();
    ctx.fillStyle = getElevationColor(region.elevation);
    map.voronoi.renderCell(index, ctx);
    ctx.fill();
  });

  //   ctx.beginPath();
  //   map.voronoi.render(ctx);
  //   map.voronoi.renderBounds(ctx);
  //   ctx.strokeStyle = "#000";
  //   ctx.stroke();

  ctx.beginPath();
  ctx.fill();
}
