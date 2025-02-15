/**
 * Round a number at N decimals
 * @param value
 * @param decimals
 * @returns
 */
export function roundAt(value: number, decimals: number): number {
  return Math.round(value * decimals * 10) / (decimals * 10);
}

/**
 * linear interpolation
 */
export function lerp(start: number, end: number, amount: number): number {
  return (1 - amount) * start + amount * end;
}

export function euclideanSquared(nx: number, ny: number): number {
  return Math.min(1, (Math.pow(nx, 2) + Math.pow(ny, 2)) / Math.sqrt(2));
}

export function squareBump(nx: number, ny: number): number {
  return 1 - (1 - Math.pow(nx, 2)) * (1 - Math.pow(ny, 2));
}

export function mapToInterval(
  oldValue: number,
  [oldMin, oldMax]: [number, number],
  [newMin, newMax]: [number, number]
) {
  return ((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
}
