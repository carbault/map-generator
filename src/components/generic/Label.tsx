import { JSX } from "react";

export default function Label(props: { children: string | JSX.Element }) {
  const { children } = props;

  return (
    <span className="text-sm text-snow font-light" role="label">
      {children}
    </span>
  );
}
