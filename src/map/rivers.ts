import { Map, RegionData, Settings } from "../types";
import { minBy, sortBy } from "../util/array";

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

    if (adjacent.length === 0) {
      return region;
    }

    const lowestAdjacent = minBy(adjacent, "elevation");
    const downslope =
      lowestAdjacent.elevation < region.elevation
        ? lowestAdjacent.index
        : minBy(adjacent, "distanceScore").index;

    return {
      ...region,
      downslope,
      watershed: downslope,
      isCoast: adjacent.some((r) => r.elevation < settings.seaLevel),
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
  const seen: number[] = [];
  const regions = [...mapRegions];

  const nextDown = (r: RegionData): RegionData | undefined => {
    return r.downslope ? regions[r.downslope] : undefined;
  };

  for (const region of sortBy(mapRegions, "elevation", "desc")) {
    const isOcean = region.elevation < settings.seaLevel;
    if (!region.downslope || !region.watershed || region.isCoast || isOcean) {
      continue;
    }

    const seenThisLoop: number[] = [];
    let current = nextDown(region);
    let iterations = 0;

    while (
      current &&
      !seen.includes(current.index) &&
      !seenThisLoop.includes(current.index) &&
      iterations < 100
    ) {
      const next = current.downslope;
      seenThisLoop.push(current.index);

      if (
        next &&
        regions[next].elevation > settings.seaLevel &&
        region.downslope !== current.downslope
      ) {
        regions[region.index].watershed = next;
        current = nextDown(current);
      }
      iterations++;
    }

    // the downslope doesn't reach the sea
    if (
      !current ||
      (current && (nextDown(current)?.elevation ?? 0) > settings.seaLevel)
    ) {
      regions[region.index].watershed = undefined;
    } else if (current) {
      if (!seen.includes(current.index)) seen.push(current.index);
      regions[region.index].watershed = regions[current.index].watershed;
    }

    seen.push(region.index);
  }

  return regions;
}
