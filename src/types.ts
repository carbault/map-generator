export type Point = { x: number; y: number };

export type Size = { height: number; width: number };

export type RegionData = {
  point: Point;
  elevation: number;
  moisture: number;
};

export type Map = {
  regions: RegionData[];
  triangleCount: number;
  delaunay: d3.Delaunay<Point>;
  voronoi: d3.Voronoi<Point>;
  scale: Size;
};

export type ShapingFunction = "euclidean-squared" | "bump-square";

export type Settings = {
  shapingFunction: ShapingFunction;
  wavelength: number;
  lerp: number;
  grid: Size;
};

export type SettingUpdater<T> = <K extends keyof T>(
  key: T
) => (value: T[K] | undefined) => void;
