import { Settings, SettingUpdater, Size } from "../types";
import Field from "./generic/Field";
import Label from "./generic/Label";
import { NumberInput } from "./generic/NumberInput";

export default function SettingList(props: {
  settings: Settings;
  onUpdateSettings: (newSettings: Settings) => void;
}) {
  const { settings, onUpdateSettings } = props;

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
    <>
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
        <Label
          tooltip={"This will affect sea level and have sort of a zoom effect"}
        >
          Wavelength
        </Label>
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
    </>
  );
}
