export type Filter = "all" | "active" | "paused";

interface Props {
  value: Filter;
  onChange: (f: Filter) => void;
  counts: { all: number; active: number; paused: number };
}

const TABS: { id: Filter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "active", label: "Activos" },
  { id: "paused", label: "Pausados" },
];

export function FilterBar({ value, onChange, counts }: Props) {
  return (
    <div className="filter-bar glass">
      {TABS.map((t) => {
        const isActive = value === t.id;

        return (
          <button
            key={t.id}
            className={`filter-tab ${isActive ? "active" : ""}`}
            onClick={() => onChange(t.id)}
          >
            {t.label}
            <span className="filter-count">{counts[t.id]}</span>
          </button>
        );
      })}
    </div>
  );
}