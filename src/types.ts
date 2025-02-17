export type Point = { x: number; y: number };

export type Size = { height: number; width: number };

export type RegionData = {
  point: Point;
  index: number;
  elevation: number;
  moisture: number; // TODO generate + mix with elevation to generate biomes
  river: number; // 0 if no river, or volume of water in river
  distanceScore: number; // used to compute path to sea
  downslope?: number; // index of lowest adjacent region
  watershed?: number; // index of coastal watershed region
  isCoast?: boolean;
};

export type Map = {
  regions: RegionData[];
  triangleCount: number;
  delaunay: d3.Delaunay<Point>;
  voronoi: d3.Voronoi<Point>;
  scale: Size;
};

export enum MapType {
  island = "island",
  coastline = "coastline",
}

export enum ShapingFunction {
  euclidean = "euclidean-squared",
  distanceSquared = "distance-squared",
  squareBump = "square-bump",
  squircle = "squircle",
}

export type Settings = {
  type: MapType;
  shapingFunction: ShapingFunction;
  seaLevel: number;
  wavelength: number;
  rainFall: number;
  lerp: number;
  grid: Size;
};

export type SettingUpdater<T> = <K extends keyof T>(
  key: T
) => (value: T[K] | undefined) => void;
