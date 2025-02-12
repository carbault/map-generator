import { useCallback, useEffect, useState } from "react";
import { buildMap } from "./drawMap";
import { DEFAULT_SETTINGS } from "./constants";
import { Settings, Size } from "./types";
import SidePanel from "./components/SidePanel";

const SETTINGS_WIDTH = 320;

export default function App() {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [canvasSize, setCanvasSize] = useState<Size>({ width: 0, height: 0 });
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [seed, setSeed] = useState(Math.random());

  const generateNewSeed = () => {
    setSeed(Math.random());
  };

  const downloadMap = () => {
    if (canvasRef) {
      const image = canvasRef.toDataURL();
      const fileName = `map_${seed.toString().replace(".", "")}.png`;
      const downloadLink = document.createElement("a");
      downloadLink.download = fileName;
      downloadLink.href = image;
      downloadLink.click();
    }
  };

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

  useEffect(() => {
    const ctx = canvasRef?.getContext("2d");
    if (canvasRef && ctx) {
      buildMap(canvasRef, ctx, settings, seed);
    }
  }, [canvasSize, canvasRef, settings, seed]);

  return (
    <div className="h-full w-full flex">
      <SidePanel
        settings={settings}
        onUpdateSettings={setSettings}
        onGenerateNewMap={generateNewSeed}
        onDownloadMap={downloadMap}
      />
      <div ref={setContainerRef} className="h-full flex flex-1">
        <canvas ref={setCanvasRef} id="container" />
      </div>
    </div>
  );
}
