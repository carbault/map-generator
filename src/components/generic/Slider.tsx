import classNames from "classnames";
import React from "react";
import { useNumericInputValue } from "../../hooks/useNumericInputValue";

export type SliderProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "onSubmit" | "value" | "type" | "min" | "max" | "step"
> & {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onSubmit: (value: number | undefined) => void;
};

const THUMB_SIZE = 16;

const Slider = React.forwardRef<HTMLInputElement, SliderProps>((props, ref) => {
  const {
    value,
    className,
    min = 0,
    max = 1,
    step = 0.01,
    onSubmit,
    ...inputProps
  } = props;

  const { inputRef, editedValue, handleSubmit, handleChange } =
    useNumericInputValue(onSubmit);

  const currentValue =
    editedValue !== null && editedValue !== undefined ? editedValue : value;
  const ratio = (currentValue - min) / (max - min);

  return (
    <div
      className={classNames(
        "group relative h-4 cursor-pointer w-full",
        className
      )}
      aria-roledescription="slider"
      role="slider"
    >
      <div className="absolute top-1 z-0 h-1 w-full rounded bg-snow">
        <div
          style={{ width: `${(currentValue / max) * 100}%` }}
          className="h-1 rounded bg-lake-shallower group-hover:bg-lake-shallow"
        />
      </div>
      <div
        className="absolute -top-0.5 h-4 w-4 rounded-full bg-lake-shallower group-hover:bg-lake-shallow border border-snow"
        style={{ left: `calc(${ratio * 100}% - ${ratio * THUMB_SIZE}px)` }}
      />
      <input
        {...inputProps}
        value={currentValue}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        onMouseUp={handleSubmit}
        ref={ref ?? inputRef}
        className="absolute top-0 left-0 h-4 w-full cursor-pointer rounded opacity-0"
        type="range"
      />
    </div>
  );
});

Slider.displayName = "Slider";
export default Slider;
