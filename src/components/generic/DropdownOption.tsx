import classNames from "classnames";
import React from "react";

export function DropdownOption(props: {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: (event: React.MouseEvent) => void;
}) {
  const { children, isSelected, onClick } = props;

  return (
    <div
      onClick={onClick}
      className={classNames(
        "flex flex-1 items-center gap-2 h-9 py-1.5 rounded hover:bg-plains-2 px-2 cursor-pointer text-settings",
        isSelected && "bg-plains-1"
      )}
    >
      {children}
    </div>
  );
}
