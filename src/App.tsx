import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { createNoise2D } from "simplex-noise";

function App() {
  const [count, setCount] = useState(0);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef) setupD3(canvasRef, window.innerWidth, window.innerHeight);
  }, [canvasRef]);

  return (
    <>
      <canvas ref={setCanvasRef} id="container" className="h-full w-full" />
    </>
  );
}

export async function setupD3(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) {
  const data: { x: number; y: number; elevation: number; color: string }[] = [];
  const noise = createNoise2D();
  const noiseE = (nx: number, ny: number) => noise(nx, ny) / 2 + 0.5;

  const ctx = canvas.getContext("2d");
  const imageData = ctx?.createImageData(1, 1);

  if (!imageData || !ctx) return;
  const scale = d3.scaleLinear([0, 0.5], ["white", "black"]); //["#7fc8eb", "#175726", "#ffffff"]);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = x / width - 0.5;
      const ny = y / height - 0.5;

      let elevation =
        1.0 * noiseE(1 * nx, 1 * ny) +
        0.5 * noiseE(2 * nx, 2 * ny) +
        0.25 * noiseE(4 * nx, 4 * ny);

      elevation = elevation / (1.0 + 0.5 + 0.25);
      elevation = roundAt(Math.pow(elevation, 1.5), 7);

      const color = d3.color(scale(elevation));
      data.push({ x, y, elevation, color: color?.formatHex() ?? "" });

      ctx.putImageData(imageData, x, y);
      ctx.fillStyle = color?.formatRgb() ?? "";
      ctx.fillRect(x, y, 1, 1);
    }
  }

  console.log(data);
}

function roundAt(value: number, decimals: number) {
  return Math.round(value * decimals * 10) / (decimals * 10);
}
export default App;
