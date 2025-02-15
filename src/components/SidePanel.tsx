import { Settings } from "../types";
import { Button } from "./generic/Button";
import { DownloadIcon } from "./generic/icons/DownloadIcon";
import { RefreshIcon } from "./generic/icons/RefreshIcon";

import SettingList from "./SettingsList";

export default function SidePanel(props: {
  settings: Settings;
  onUpdateSettings: (newSettings: Settings) => void;
  onGenerateNewMap: () => void;
  onDownloadMap: () => void;
}) {
  const { settings, onUpdateSettings, onGenerateNewMap, onDownloadMap } = props;

  return (
    <div className="h-full w-xs flex flex-col gap-4 p-6 bg-settings border-r border-r-sea-shallower overflow-hidden">
      <h1 className="text-3xl font-medium text-plains-1 uppercase">Settings</h1>
      <SettingList settings={settings} onUpdateSettings={onUpdateSettings} />
      <Button className="mt-auto uppercase" onClick={onDownloadMap}>
        <DownloadIcon />
        Download
      </Button>
      <Button onClick={onGenerateNewMap} className="uppercase">
        <RefreshIcon />
        New map
      </Button>
    </div>
  );
}
