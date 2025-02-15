export type Point = { x: number; y: number };

export type Size = { height: number; width: number };

export type RegionData = {
  point: Point;
  index: number;
  elevation: number;
  moisture: number; // TODO generate + mix with elevation to generate biomes
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
  lerp: number;
  grid: Size;
};

export type SettingUpdater<T> = <K extends keyof T>(
  key: T
) => (value: T[K] | undefined) => void;
