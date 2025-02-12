import { useCallback, useEffect, useState } from "react";
import { buildMap } from "./drawMap";
import { DEFAULT_SETTINGS } from "./constants";
import { Settings } from "./types";
import SidePanel from "./components/SidePanel";

const SETTINGS_WIDTH = 320;

export default function App() {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
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

  const scaleCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const scale = window.devicePixelRatio;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    canvas.width = canvas.width * scale;
    canvas.height = canvas.height * scale;
  }, []);

  useEffect(() => {
    if (canvasRef) {
      scaleCanvas(canvasRef);
    }
  }, [canvasRef, scaleCanvas]);

  useEffect(() => {
    const ctx = canvasRef?.getContext("2d");
    if (canvasRef && ctx) {
      buildMap(canvasRef, ctx, settings, seed);
    }
  }, [canvasRef, settings, seed, scaleCanvas]);

  return (
    <div className="h-full w-full flex">
      <SidePanel
        settings={settings}
        onUpdateSettings={setSettings}
        onGenerateNewMap={generateNewSeed}
        onDownloadMap={downloadMap}
      />
      <canvas
        ref={setCanvasRef}
        id="container"
        width={window.innerWidth - SETTINGS_WIDTH}
        height={window.innerHeight}
      />
    </div>
  );
}
