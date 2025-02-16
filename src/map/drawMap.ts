import { Settings, Size, Map } from "../types";

export function drawMapOnCanvas(
  map: Map,
  ctx: CanvasRenderingContext2D,
  canvasSize: Size,
  settings: Settings
) {
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  ctx.lineWidth = 1;

  // draw regions
  map.regions.forEach((region, index) => {
    ctx.beginPath();
    const color = getElevationColor(region.elevation, settings);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.stroke(new Path2D(map.voronoi.renderCell(index)));
    map.voronoi.renderCell(index, ctx);
    ctx.fill();
    ctx.closePath();
  });

  // draw rivers
  const seen: number[] = [];
  map.regions.forEach((region) => {
    ctx.beginPath();
    ctx.strokeStyle = "#093a5d";
    ctx.lineWidth = 2;

    let riverCell = region;
    ctx.beginPath();
    ctx.moveTo(region.point.x, region.point.y);
    while (
      riverCell &&
      riverCell.downslope &&
      riverCell.watershed &&
      riverCell.index !== region.watershed &&
      !seen.includes(riverCell.index) &&
      riverCell.elevation > settings.seaLevel
    ) {
      const downslope = map.regions[riverCell.downslope];
      ctx.lineTo(downslope.point.x, downslope.point.y);
      ctx.stroke();
      riverCell = downslope;
    }
    ctx.closePath();
  });
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
