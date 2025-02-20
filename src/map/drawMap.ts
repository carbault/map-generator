import { MAX_RIVER_WIDTH } from "../constants";
import { Settings, Size, Map, RegionData } from "../types";

export function drawMapOnCanvas(
  map: Map,
  ctx: CanvasRenderingContext2D,
  canvasSize: Size,
  settings: Settings
) {
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  drawRegions(ctx, map, settings);
  drawRivers(ctx, map.regions, settings);
}

function drawRegions(
  ctx: CanvasRenderingContext2D,
  map: Map,
  settings: Settings
) {
  ctx.lineWidth = 1;
  for (const region of map.regions) {
    ctx.beginPath();
    const color = getElevationColor(region.elevation, settings);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.stroke(new Path2D(map.voronoi.renderCell(region.index)));
    map.voronoi.renderCell(region.index, ctx);
    ctx.fill();
    ctx.closePath();
  }
}

function drawRivers(
  ctx: CanvasRenderingContext2D,
  regions: RegionData[],
  settings: Settings
) {
  const seen: number[] = [];
  ctx.strokeStyle = "#0B466F";

  const springCandidates = regions
    .slice()
    .filter((r) => !!r.watershed && r.elevation > 0.75);

  const maxSprings = (settings.rainFall / 100) * springCandidates.length;
  const springs: RegionData[] = [];
  for (let i = 0; i <= maxSprings; i++) {
    const randIndex = Math.floor(Math.random() * springCandidates.length);
    if (!springs.some((s) => s.index === springCandidates[randIndex].index)) {
      springs.push(springCandidates[randIndex]);
    }
  }

  for (const region of springs) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    let riverCell = region;
    let riverBend = 0;

    while (
      riverCell &&
      riverCell.downslope &&
      riverCell.index !== region.watershed &&
      !seen.includes(riverCell.index)
    ) {
      ctx.beginPath();
      ctx.moveTo(riverCell.point.x, riverCell.point.y);
      const nextDown = regions[riverCell.downslope];

      const center = {
        x: (riverCell.point.x + nextDown.point.x) / 2,
        y: (riverCell.point.y + nextDown.point.y) / 2,
      };

      const diffX = riverCell.point.x - center.x;
      const diffY = riverCell.point.y - center.y;
      const radius = Math.abs(
        Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
      );
      const startAngle = Math.atan2(diffY, diffX);
      const endAngle = Math.atan2(
        nextDown.point.y - center.y,
        nextDown.point.x - center.x
      );
      ctx.arc(
        center.x,
        center.y,
        radius,
        startAngle,
        endAngle,
        riverBend % 2 === 0 // alternate clockwise and counterclockwise bends
      );
      ctx.stroke();
      riverBend++;
      ctx.lineWidth = Math.min(MAX_RIVER_WIDTH, 2 + riverBend * 0.3);
      ctx.closePath();
      riverCell = nextDown;
    }
  }
}

function getElevationColor(elevation: number, settings: Settings): string {
  // sea
  if (elevation < settings.seaLevel - 0.2) return "#062337";
  if (elevation < settings.seaLevel - 0.15) return "#072F4B";
  if (elevation < settings.seaLevel - 0.1) return "#093A5D";
  if (elevation < settings.seaLevel) return "#0B466F";
  // land
  if (elevation < settings.seaLevel + 0.1) return "#b0cea1";
  if (elevation < settings.seaLevel + 0.2) return "#9CC18A";
  if (elevation < settings.seaLevel + 0.3) return "#8EB979";
  if (elevation < settings.seaLevel + 0.35) return "#83B26C";
  if (elevation < settings.seaLevel + 0.4) return "#79AB5F";
  if (elevation < settings.seaLevel + 0.45) return "#6EA054";
  // snow
  return "#F0EEE1";
}
