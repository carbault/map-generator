export default function Field(props: { children: React.ReactNode }) {
  const { children } = props;

  return <div className="flex flex-col gap-2 items-start">{children}</div>;
}
