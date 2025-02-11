import { createNoise2D, NoiseFunction2D } from "simplex-noise";
import { Map, Point, Size } from "./types";
import * as d3 from "d3";
import { lerp } from "./util/math";

const WAVELENGTH = 0.5;
const JITTER = 0.5;
const grid: Size = { width: 200, height: 100 }; // todo move to react state

export function buildMap(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  const { points, xScale, yScale } = getPointsAndScale(canvas);
  const delaunay = d3.Delaunay.from(
    points,
    (p) => p.x,
    (p) => p.y
  );

  const elevationNoise = createNoise2D();

  const map: Map = {
    regions: points.map((point) => ({
      point,
      elevation: getElevation(point, xScale, yScale, grid, elevationNoise),
      moisture: 0,
    })),
    delaunay,
    triangleCount: delaunay.halfedges.length / 3,
    voronoi: delaunay.voronoi([0, 0, canvas.width, canvas.height]),
    xScale,
    yScale,
  };

  drawMapOnCanvas(map, ctx, {
    height: canvas.height,
    width: canvas.width,
  });
}

function getPointsAndScale(canvas: HTMLCanvasElement) {
  const points: Point[] = [];

  const xScale = (canvas.width / grid.width) * window.devicePixelRatio;
  const yScale = (canvas.height / grid.height) * window.devicePixelRatio;

  for (let x = 0; x <= grid.width; x++) {
    for (let y = 0; y <= grid.height; y++) {
      points.push({
        x: (x + JITTER * (Math.random() - Math.random())) * xScale,
        y: (y + JITTER * (Math.random() - Math.random())) * yScale,
      });
    }
  }

  return { xScale, yScale, points };
}

function getElevation(
  point: Point,
  xScale: number,
  yScale: number,
  grid: Size,
  noise: NoiseFunction2D
) {
  const nx = (2 * point.x) / xScale / (grid.width - 1);
  const ny = (2 * point.y) / yScale / (grid.height - 1);
  const baseElevation = (1 + noise(nx / WAVELENGTH, ny / WAVELENGTH)) / 2;
  // const d = 2 * Math.max(Math.abs(nx), Math.abs(ny)); // should be 0-1
  const d = Math.min(1, (Math.pow(nx, 2) + Math.pow(ny, 2)) / Math.sqrt(2));
  const elevation = lerp(baseElevation, 1 - d, 0.25);
  console.log(nx, ny, baseElevation, d, elevation);
  return elevation;
  // return (1 + pointElevation - d) / 2;
}

function getElevationColor(elevation: number): string {
  if (elevation < 0.3) return "#062337";
  if (elevation < 0.35) return "#072F4B";
  if (elevation < 0.4) return "#093A5D";
  if (elevation < 0.5) return "#0B466F";
  if (elevation < 0.6) return "##8EB979";
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
