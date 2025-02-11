/**
 * Round a number at N decimals
 * @param value
 * @param decimals
 * @returns
 */
export function roundAt(value: number, decimals: number) {
  return Math.round(value * decimals * 10) / (decimals * 10);
}

/**
 * linear interpolation
 */
export function lerp(start: number, end: number, amount: number) {
  return (1 - amount) * start + amount * end;
}
