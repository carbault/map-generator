import classNames from "classnames";
import React from "react";
import { useNumericInputValue } from "../../hooks/useNumericInputValue";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "defaultValue" | "type" | "onBlur" | "onSubmit"
> & {
  value: number | undefined;
  onSubmit: (newValue: number | undefined) => void;
};

const NumberInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { value, onSubmit, className, ...restProps } = props;

    const { inputRef, editedValue, handleSubmit, handleChange, handleKeyDown } =
      useNumericInputValue(onSubmit);

    return (
      <input
        {...restProps}
        value={editedValue ?? value}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        ref={inputRef ?? ref}
        style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
        className={classNames(
          className,
          "h-9 px-2 bg-snow focus:outline-none placeholder:text-gray-500 rounded border border-gray-500 hover:shadow-hover disabled:text-gray-500 focus:enabled:border-lake-shallower focus:border-2 w-full"
        )}
        type="number"
      />
    );
  }
);

NumberInput.displayName = "NumberInput";
export default NumberInput;
