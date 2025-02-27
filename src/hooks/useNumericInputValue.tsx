import React, { useRef, useState, useCallback } from "react";

export function useNumericInputValue(
  onSubmit: (newValue: number | undefined) => void
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isEscapePressed = useRef<boolean>(false);
  const [editedValue, setEditedValue] = useState<number>();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const valueAsNumber = event.currentTarget.valueAsNumber;
      if (isFinite(valueAsNumber)) {
        setEditedValue(valueAsNumber);
        return;
      }
      setEditedValue(undefined);
    },
    []
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        isEscapePressed.current = true;
        inputRef.current?.blur();
      }

      if (event.key === "Enter") {
        inputRef.current?.blur();
      }
    },
    []
  );

  const handleSubmit = useCallback(() => {
    if (isEscapePressed.current) {
      setEditedValue(undefined);
    } else {
      onSubmit(editedValue);
      setEditedValue(undefined);
    }
    isEscapePressed.current = false;
  }, [onSubmit, editedValue]);

  return {
    inputRef,
    editedValue,
    handleChange,
    handleKeyDown,
    handleSubmit,
  };
}
