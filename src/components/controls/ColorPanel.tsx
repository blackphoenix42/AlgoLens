// src/components/controls/ColorPanel.tsx
type Props = {
  value: {
    base: string;
    compared: string;
    swapped: string;
    pivot: string;
    highlighted: string;
  };
  onChange: (v: Props["value"]) => void;
};

export default function ColorPanel({ value, onChange }: Props) {
  const upd =
    (k: keyof Props["value"]) => (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [k]: e.target.value });

  return (
    <div className="card">
      <div className="text-sm font-medium mb-2">Colors</div>

      {/* grid: [label picker] [label picker] */}
      <div
        className="grid items-center gap-x-4 gap-y-2"
        style={{ gridTemplateColumns: "auto auto auto auto" }}
      >
        <span className="text-sm">Base</span>
        <input type="color" value={value.base} onChange={upd("base")} />

        <span className="text-sm">Compared</span>
        <input type="color" value={value.compared} onChange={upd("compared")} />

        <span className="text-sm">Swapped</span>
        <input type="color" value={value.swapped} onChange={upd("swapped")} />

        <span className="text-sm">Pivot</span>
        <input type="color" value={value.pivot} onChange={upd("pivot")} />

        <span className="text-sm">Highlight</span>
        <input
          type="color"
          value={value.highlighted}
          onChange={upd("highlighted")}
        />
        {/* If you ever add a 6th color, it will naturally occupy the remaining two cells of the last row */}
      </div>
    </div>
  );
}
