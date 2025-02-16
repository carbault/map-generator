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

  //   ctx.beginPath();
  //   ctx.strokeStyle = "white";
  //   ctx.fillStyle = "white";
  //   ctx.lineWidth = 1;
  //   map.delaunay.render(ctx);
  //   ctx.stroke();
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
  ctx.lineWidth = 2;

  for (const region of regions) {
    if (!region.watershed) {
      continue;
    }

    ctx.beginPath();
    let riverCell = region;
    ctx.moveTo(region.point.x, region.point.y);

    while (
      riverCell &&
      riverCell.downslope &&
      riverCell.index !== region.downslope &&
      !seen.includes(riverCell.index) &&
      riverCell.elevation > settings.seaLevel
    ) {
      const nextDown = regions[riverCell.downslope];
      ctx.lineTo(nextDown.point.x, nextDown.point.y);
      ctx.stroke();
      riverCell = nextDown;
    }
    ctx.closePath();
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
