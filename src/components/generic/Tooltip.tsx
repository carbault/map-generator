import {
  TooltipProvider,
  Tooltip as TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipArrow,
} from "@radix-ui/react-tooltip";

export default function Tooltip(props: {
  children: React.ReactNode;
  content: string | React.JSX.Element;
}) {
  const { children, content } = props;

  return (
    <TooltipProvider>
      <TooltipRoot delayDuration={0}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            className="select-none rounded px-1.5 py-1 text-xs bg-plains-1 text-sea-deeper"
            sideOffset={5}
          >
            {content}
            <TooltipArrow className="fill-plains-1" />
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  );
}
