import * as Popover from "@radix-ui/react-popover";
import React, { useState } from "react";
import Button from "./Button";
import ChevronIcon from "./icons/ChevronIcon";
import DropdownOption from "./DropdownOption";
import classNames from "classnames";

export default function Select<T extends React.Key>(props: {
  value: T | undefined;
  onChange: (newValue: T | undefined) => void;
  items: { value: T; label: string }[];
  className?: string;
}) {
  const { value, onChange, items, className } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleSelectValue = (newValue: T) => () => {
    onChange(newValue === value ? undefined : newValue);
    setIsOpen(false);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <Button className={classNames("w-full h-9!", className)}>
          {items.find((i) => i.value === value)?.label}
          <ChevronIcon
            className={classNames(
              "ml-auto min-w-4 transition duration-150 ease-in-out",
              isOpen && "rotate-180"
            )}
          />
        </Button>
      </Popover.Trigger>
      <Popover.Content
        align="start"
        className="my-1 w-[var(--radix-popover-trigger-width)] max-h-[min(var(--radix-popover-content-available-height),300px)] rounded border shadow-md bg-snow border-gray-100 p-1 overflow-hidden flex flex-col overflow-y-auto gap-1 z-10"
      >
        {items.map((item, index) => (
          <DropdownOption
            key={index}
            onClick={handleSelectValue(item.value)}
            isSelected={item.value === value}
          >
            {item.label}
          </DropdownOption>
        ))}
      </Popover.Content>
    </Popover.Root>
  );
}
