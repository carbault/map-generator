import { useState, useCallback, useEffect } from "react";
import { Size } from "../types";

/**
 * Handle canvas ref and automating resizing
 * based on window size and screen resolution
 */

export function useHandleMapCanvas() {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [canvasSize, setCanvasSize] = useState<Size>({ width: 0, height: 0 });

  const scaleCanvas = useCallback((canvas: HTMLCanvasElement, size: Size) => {
    const scale = window.devicePixelRatio;
    canvas.style.width = size.width + "px";
    canvas.style.height = size.height + "px";
    canvas.width = size.width * scale;
    canvas.height = size.height * scale;
  }, []);

  useEffect(() => {
    if (canvasRef && containerRef) {
      const observer = new ResizeObserver((entries) => {
        if (entries[0]) {
          const size = {
            width: entries[0].contentRect.width,
            height: entries[0].contentRect.height,
          };
          setCanvasSize(size);
          scaleCanvas(canvasRef, size);
        }
      });
      observer.observe(containerRef);
      return () => {
        observer.disconnect();
      };
    }
  }, [canvasRef, containerRef, scaleCanvas]);

  return {
    canvasRef,
    canvasSize,
    setCanvasRef,
    setContainerRef,
  };
}
