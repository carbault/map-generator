export type Point = { x: number; y: number };

export type Size = { height: number; width: number };

export type BaseRegionData = {
  point: Point;
  index: number;
  elevation: number;
  moisture: number; // TODO generate + mix with elevation to generate biomes
  distanceScore: number; // used to compute path to sea
};

export type RegionDataWithDownslope = BaseRegionData & {
  downslope: number; // index of lowest adjacent region
  isCoast: boolean;
};

export type FullRegionData = RegionDataWithDownslope & {
  river: number; // 0 if no river, or volume of water in river
  watershed: number | null; // index of coastal watershed region
};

export type Map = {
  regions: FullRegionData[];
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
