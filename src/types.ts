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
  xScale: number;
  yScale: number;
};
