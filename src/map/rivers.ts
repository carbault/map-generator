import { Map, RegionData, Settings } from "../types";
import { minBy } from "../util/array";

export function calculateRivers(map: Map, settings: Settings): Map {
  let regions = calculateDownslopes(map, settings);
  regions = calculateWatersheds(regions, settings);

  return { ...map, regions };
}

/**
 * For each region, get the one downstream from it
 * This is used to calculate rivers
 */
function calculateDownslopes(map: Map, settings: Settings): RegionData[] {
  return map.regions.map((region, i) => {
    const adjacent = Array.from(map.voronoi.neighbors(i)).map(
      (i) => map.regions[i]
    );

    const downslope =
      adjacent.length > 0 ? minBy(adjacent, "elevation").index : undefined;

    return {
      ...region,
      downslope,
      isCoast: adjacent.some((r) => r.elevation < settings.seaLevel),
      // init watershed as 1 region down
      watershed: downslope,
    };
  });
}

/**
 * For each region, calculate the watershed: the lowest
 * downslope region, where the rivers will meet the sea
 */
function calculateWatersheds(
  mapRegions: RegionData[],
  settings: Settings
): RegionData[] {
  let regions = [...mapRegions];

  const nextDownslope = (r: RegionData): RegionData | undefined => {
    return r.watershed ? regions[r.watershed] : undefined;
  };

  for (const region of mapRegions) {
    if (
      !region.downslope ||
      region.isCoast ||
      region.elevation < settings.seaLevel
    ) {
      continue;
    }

    let watershed = nextDownslope(region);
    let iterations = 0;
    while (
      watershed &&
      !watershed.isCoast &&
      watershed.elevation > settings.seaLevel &&
      iterations < 50
    ) {
      const newWatershed = watershed.watershed;
      if (newWatershed && regions[newWatershed].elevation > settings.seaLevel) {
        regions[region.index] = { ...region, watershed: newWatershed };
        console.log(newWatershed, iterations);
        watershed = nextDownslope(watershed);
      } else {
        watershed = undefined;
      }
      iterations++;
    }
  }

  console.log(regions);
  return regions;
}
