import {
  MapType,
  Settings,
  SettingUpdater,
  ShapingFunction,
  Size,
} from "../types";
import { capitalize } from "../util/str";
import Field from "./generic/Field";
import Label from "./generic/Label";
import NumberInput from "./generic/NumberInput";
import Select from "./generic/Select";
import Slider from "./generic/Slider";

const SHAPING_FN_LABEL: Record<ShapingFunction, string> = {
  "square-bump": "Rounded rectangle",
  "euclidean-squared": "Oval",
  "distance-squared": "Oval variant",
  squircle: "Squared circle",
};

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
    if (value !== undefined) {
      onUpdateSettings({
        ...settings,
        grid: { ...settings.grid, [side]: value },
      });
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto">
      <Field>
        <Label>Map type</Label>
        <Select
          value={settings.type}
          onChange={updateSetting("type")}
          items={Object.keys(MapType).map((value) => ({
            value,
            label: capitalize(value),
          }))}
        />
      </Field>
      <Field>
        <Label>Shaping type</Label>
        <Select
          value={settings.shapingFunction}
          onChange={updateSetting("shapingFunction")}
          items={Object.values(ShapingFunction).map((value) => ({
            value,
            label: SHAPING_FN_LABEL[value],
          }))}
        />
      </Field>
      <Field>
        <Label tooltip="Affects how close the island shape is to the shape type">
          Smooth coasts
        </Label>
        <Slider
          min={0}
          max={1}
          value={settings.lerp}
          onSubmit={updateSetting("lerp")}
        />
      </Field>
      <Field>
        <Label tooltip="Affects how the noise is applied to the map and the island shape">
          Wavelength
        </Label>
        <Slider
          min={0}
          max={0.3}
          step={0.001}
          value={settings.wavelength}
          onSubmit={updateSetting("wavelength")}
        />
      </Field>
      <Field>
        <Label>Sea level</Label>
        <Slider
          min={0}
          max={1}
          value={settings.seaLevel}
          onSubmit={updateSetting("seaLevel")}
        />
      </Field>
      <Field>
        <Label>Rainfall</Label>
        <Slider
          min={2}
          max={30}
          value={settings.rainFall}
          onSubmit={updateSetting("rainFall")}
        />
      </Field>
      <Field>
        <Label>Grid height</Label>
        <NumberInput
          min={25}
          max={500}
          value={settings.grid.height}
          onSubmit={updateGridSize("height")}
        />
      </Field>
      <Field>
        <Label>Grid width</Label>
        <NumberInput
          min={50}
          max={1000}
          value={settings.grid.width}
          onSubmit={updateGridSize("width")}
        />
      </Field>
    </div>
  );
}
