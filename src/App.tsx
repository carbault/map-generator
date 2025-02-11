import { useCallback, useEffect, useState } from "react";
import { buildMap } from "./drawMap";

export default function App() {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  /**
   * scale canvas to account for pixel density
   * (avoid blurry canvas)
   */
  const scaleCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const scale = window.devicePixelRatio;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    canvas.width = canvas.width * scale;
    canvas.height = canvas.height * scale;
  }, []);

  useEffect(() => {
    const ctx = canvasRef?.getContext("2d");
    if (canvasRef && ctx) {
      scaleCanvas(canvasRef);
      buildMap(canvasRef, ctx);
    }
  }, [canvasRef, scaleCanvas]);

  return (
    <>
      <canvas
        ref={setCanvasRef}
        id="container"
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ width: window.innerWidth, height: window.innerHeight }}
      />
    </>
  );
}
