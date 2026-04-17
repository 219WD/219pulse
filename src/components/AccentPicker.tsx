import type { AccentColor } from "../types";

interface Props {
  value: AccentColor;
  onChange: (accent: AccentColor) => void;
}

const ACCENTS: {
  id: AccentColor;
  label: string;
  gradient: string;
  ring: string;
}[] = [
  {
    id: "violet",
    label: "Violeta",
    gradient: "linear-gradient(135deg, hsl(268 92% 68%), hsl(290 95% 70%))",
    ring: "hsl(268 92% 68% / 0.45)",
  },
  {
    id: "cyan",
    label: "Cian",
    gradient: "linear-gradient(135deg, hsl(195 100% 60%), hsl(220 95% 65%))",
    ring: "hsl(195 100% 60% / 0.45)",
  },
  {
    id: "pink",
    label: "Rosa",
    gradient: "linear-gradient(135deg, hsl(330 90% 65%), hsl(290 95% 70%))",
    ring: "hsl(330 90% 65% / 0.45)",
  },
  {
    id: "emerald",
    label: "Esmeralda",
    gradient: "linear-gradient(135deg, hsl(152 76% 56%), hsl(180 80% 55%))",
    ring: "hsl(152 76% 56% / 0.45)",
  },
  {
    id: "amber",
    label: "Ámbar",
    gradient: "linear-gradient(135deg, hsl(38 95% 60%), hsl(20 95% 60%))",
    ring: "hsl(38 95% 60% / 0.45)",
  },
];

export function AccentPicker({ value, onChange }: Props) {
  return (
    <div className="accent-picker">
      {ACCENTS.map((a) => (
        <button
          key={a.id}
          type="button"
          className={`accent-dot ${value === a.id ? "active" : ""}`}
          style={{
            background: a.gradient,
            boxShadow: value === a.id ? `0 0 20px ${a.ring}` : undefined,
          }}
          onClick={() => onChange(a.id)}
          title={a.label}
          aria-label={a.label}
        />
      ))}
    </div>
  );
}