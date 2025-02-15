import classNames from "classnames";
import React, { useRef, useState } from "react";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "defaultValue" | "type" | "onBlur" | "onSubmit"
> & {
  value: number | undefined;
  onChange: (newValue: number | undefined) => void;
};

const NumberInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { value, onChange, className, ...restProps } = props;

    const inputRef = useRef<HTMLInputElement>(null);
    const isEscapePressed = useRef<boolean>(false);
    const [editedValue, setEditedValue] = useState<number>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const valueAsNumber = event.currentTarget.valueAsNumber;
      if (isFinite(valueAsNumber)) {
        setEditedValue(valueAsNumber);
        onChange(valueAsNumber);
        return;
      }
      setEditedValue(undefined);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        isEscapePressed.current = true;
        inputRef.current?.blur();
      }

      if (event.key === "Enter") {
        inputRef.current?.blur();
      }
    };

    const handleBlur = () => {
      if (isEscapePressed.current) {
        setEditedValue(undefined);
      } else {
        onChange(editedValue);
        setEditedValue(undefined);
      }
      isEscapePressed.current = false;
    };

    return (
      <input
        {...restProps}
        value={editedValue ?? value}
        onBlur={handleBlur}
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
