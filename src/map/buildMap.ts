import { createNoise2D } from "simplex-noise";
import { Map, Point, Settings, Size } from "../types";
import * as d3 from "d3";
import { JITTER } from "../constants";
import { drawMapOnCanvas } from "./drawMap";
import { getElevationAndDistanceScore } from "./elevation";
import { calculateRivers } from "./rivers";

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
  const voronoi = delaunay.voronoi([0, 0, canvas.width, canvas.height]);
  const canvasSize = {
    height: canvas.width,
    width: canvas.height,
  };

  const baseRegionData = points.map((point, index) => ({
    point,
    index,
    ...getElevationAndDistanceScore(point, scale, settings, elevationNoise),
    moisture: 0,
    river: 0,
  }));

  const map: Map = {
    regions: calculateRivers(baseRegionData, voronoi, settings),
    delaunay,
    triangleCount: delaunay.halfedges.length / 3,
    voronoi,
    scale,
  };
  drawMapOnCanvas(map, ctx, canvasSize, settings);
}

function getPointsAndScale(
  canvas: HTMLCanvasElement,
  settings: Settings
): { points: Point[]; scale: Size } {
  const points: Point[] = [];
  const scale = {
    width: canvas.width / settings.grid.width,
    height: canvas.height / settings.grid.height,
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
