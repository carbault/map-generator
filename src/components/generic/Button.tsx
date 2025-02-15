import classNames from "classnames";
import React from "react";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  const { className, ...divProps } = props;

  return (
    <button
      className={classNames(
        "rounded flex overflow-hidden h-10 text-nowrap bg-lake-shallower text-snow hover:bg-lake-shallow hover:shadow-hover text-ellipsis whitespace-nowrap p-2 cursor-pointer data-[state=open]:bg-lake-shallow flex-nowrap gap-2 items-center justify-center !text-center",
        className
      )}
      {...divProps}
      ref={ref}
    />
  );
});

Button.displayName = "Button";
export default Button;
