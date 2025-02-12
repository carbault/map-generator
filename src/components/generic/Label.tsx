import { JSX } from "react";
import { HelpIcon } from "./icons/HelpIcon";
import Tooltip from "./Tooltip";

export default function Label(props: {
  children: string | JSX.Element;
  tooltip?: string | JSX.Element;
}) {
  const { children, tooltip } = props;

  return (
    <div
      className="text-sm text-snow font-light flex gap-1 items-center"
      role="label"
    >
      {children}
      {tooltip && (
        <Tooltip content={tooltip}>
          <HelpIcon className="text-lake-shallower h-4 w-4" />
        </Tooltip>
      )}
    </div>
  );
}
