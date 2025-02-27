import { shuffle, Voronoi } from "d3";
import {
  FullRegionData,
  Settings,
  BaseRegionData,
  Point,
  RegionDataWithDownslope,
} from "../types";
import { minBy } from "../util/array";

export function calculateRivers(
  regions: BaseRegionData[],
  voronoi: Voronoi<Point>,
  settings: Settings
): FullRegionData[] {
  return calculateWatersheds(
    calculateDownslopes(regions, voronoi, settings),
    settings
  );
}

/**
 * For each region, get the one downstream from it
 * This is used to calculate rivers
 */
function calculateDownslopes(
  regions: BaseRegionData[],
  voronoi: Voronoi<Point>,
  settings: Settings
): RegionDataWithDownslope[] {
  return regions.map((region, i) => {
    const adjacent = Array.from(voronoi.neighbors(i)).map((i) => regions[i]);

    if (adjacent.length === 0) {
      return { ...region, downslope: 0, isCoast: false };
    }

    const lowestAdjacent = minBy(adjacent, "elevation");
    const downslope =
      lowestAdjacent.elevation < region.elevation
        ? lowestAdjacent.index
        : minBy(adjacent, "distanceScore").index;

    return {
      ...region,
      downslope,
      isCoast: adjacent.some((r) => r.elevation < settings.seaLevel),
    };
  });
}

/**
 * For each region, calculate the watershed: the lowest
 * downslope region, where the river will meet the sea
 */
function calculateWatersheds(
  mapRegions: RegionDataWithDownslope[],
  settings: Settings
): FullRegionData[] {
  const seen: number[] = [];
  const regions: FullRegionData[] = mapRegions.map((r) => ({
    ...r,
    watershed: null,
    river: 0,
  }));
  let springCount = 0;

  const springCandidates = shuffle(
    regions.slice().filter((r) => r.elevation > 0.75 && !!r.downslope)
  );
  const maxSprings = (settings.rainFall / 100) * springCandidates.length;

  const nextDown = (r: FullRegionData): FullRegionData | undefined => {
    return r.downslope ? regions[r.downslope] : undefined;
  };

  for (
    let i = 0;
    i < springCandidates.length && springCount < maxSprings;
    i++
  ) {
    const region = springCandidates[i];
    const isOcean = region.elevation < settings.seaLevel;
    if (!region.downslope || region.isCoast || isOcean) {
      continue;
    }

    const seenThisLoop: number[] = [];
    let current = nextDown(region);
    let iterations = 0;

    while (
      current &&
      !seen.includes(current.index) &&
      !seenThisLoop.includes(current.index) &&
      iterations < 50
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
      regions[region.index].watershed = null;
    } else if (current) {
      if (!seen.includes(current.index)) seen.push(current.index);
      regions[region.index].watershed = regions[current.index].downslope;
      regions[region.index].river = iterations;
      springCount += 1;
    }

    seen.push(region.index);
  }

  return regions;
}
