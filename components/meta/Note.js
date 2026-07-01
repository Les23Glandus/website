import "../../styles/meta_note.scss";

const DESC = ["Nul", "Bof", "Bien", "Trés bien", "Excellente"];

export default function Note({ value, light, compact }) {
  if (!value) return <span />;

  const v = value || 3;
  const div = Math.round(10 * (v % 1));

  return (
    <span className={"note " + (light ? "light" : "dark")} title={DESC[Math.floor(v)]}>
      {Math.floor(v)}
      {div !== 0 && <span className="div">.{div}</span>}
      {!compact && <i>/5</i>}
    </span>
  );
}
