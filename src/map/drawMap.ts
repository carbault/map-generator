import { MAX_RIVER_WIDTH } from "../constants";
import { Settings, Size, Map, FullRegionData } from "../types";

export function drawMapOnCanvas(
  map: Map,
  ctx: CanvasRenderingContext2D,
  canvasSize: Size,
  settings: Settings
) {
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  drawRegions(ctx, map, settings);
  drawRivers(ctx, map.regions);
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

function drawRivers(ctx: CanvasRenderingContext2D, regions: FullRegionData[]) {
  const seen: number[] = [];
  ctx.strokeStyle = "#0B466F";

  const springs = regions.slice().filter((r) => !!r.watershed);

  for (const region of springs) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    let riverCell = region;

    while (
      riverCell &&
      riverCell.downslope &&
      riverCell.index !== region.watershed &&
      !seen.includes(riverCell.index)
    ) {
      ctx.beginPath();
      ctx.moveTo(riverCell.point.x, riverCell.point.y);
      const nextDown = regions[riverCell.downslope];
      ctx.lineTo(nextDown.point.x, nextDown.point.y);
      ctx.stroke();
      ctx.lineWidth = Math.min(MAX_RIVER_WIDTH, (ctx.lineWidth += 0.3));
      ctx.closePath();
      seen.push(riverCell.index);
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
