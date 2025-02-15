import { useEffect, useState } from "react";
import { buildMap } from "./map/buildMap";
import { DEFAULT_SETTINGS } from "./constants";
import { Settings } from "./types";
import SidePanel from "./components/SidePanel";
import { useHandleMapCanvas } from "./hooks/useHandleMapCanvas";

export default function App() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [seed, setSeed] = useState(Math.random());
  const { setCanvasRef, setContainerRef, canvasRef, canvasSize } =
    useHandleMapCanvas();

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
