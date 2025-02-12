import { Settings, SettingUpdater, Size } from "../types";
import { Button } from "./generic/Button";
import Field from "./generic/Field";
import Label from "./generic/Label";
import { NumberInput } from "./generic/NumberInput";

export default function SettingsPanel(props: {
  settings: Settings;
  onUpdateSettings: (newSettings: Settings) => void;
  onGenerateNewMap: () => void;
}) {
  const { settings, onUpdateSettings, onGenerateNewMap } = props;

  const updateSetting: SettingUpdater<keyof Settings> =
    (setting) => (newValue) => {
      if (newValue !== undefined) {
        onUpdateSettings({ ...settings, [setting]: newValue });
      }
    };

  const updateGridSize = (side: keyof Size) => (value: number | undefined) => {
    if (value !== undefined && value >= 0) {
      onUpdateSettings({
        ...settings,
        grid: { ...settings.grid, [side]: value },
      });
    }
  };

  return (
    <div className="h-full w-xs flex flex-col gap-4 p-6 bg-settings border-r border-r-sea-shallower">
      <h1 className="text-3xl font-medium text-plains-1 uppercase">Settings</h1>
      <Field>
        <Label>Sea level</Label>
        <NumberInput
          min={0}
          max={1}
          value={settings.lerp}
          onChange={updateSetting("lerp")}
        />
      </Field>
      <Field>
        <Label>Wavelength</Label>
        <NumberInput
          min={0}
          max={1}
          value={settings.wavelength}
          onChange={updateSetting("wavelength")}
        />
      </Field>
      <Field>
        <Label>Grid height</Label>
        <NumberInput
          min={25}
          max={500}
          value={settings.grid.height}
          onChange={updateGridSize("height")}
        />
      </Field>
      <Field>
        <Label>Grid width</Label>
        <NumberInput
          min={50}
          max={1000}
          value={settings.grid.width}
          onChange={updateGridSize("width")}
        />
      </Field>
      <Button onClick={onGenerateNewMap} className="mt-auto uppercase">
        New map
      </Button>
    </div>
  );
}
