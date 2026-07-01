export default function Slice({ children, className = "", breath = false, colored = false, nopadding = false }) {
  const c = ["slice"];
  if (breath) c.push("breath");
  if (colored) c.push("zoning");
  if (nopadding) c.push("nopadding");

  const b = ["container"];
  if (className) b.push(className);

  return (
    <div className={c.join(" ")}>
      <div className={b.join(" ")}>{children}</div>
    </div>
  );
}
