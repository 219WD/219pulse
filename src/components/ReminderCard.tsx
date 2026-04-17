import { Bell, BellOff, Copy, Pencil, Trash2, Vibrate } from "lucide-react";
import type { Reminder } from "../types";
import { formatCountdown, formatInterval } from "../utils/time";
import { SOUND_OPTIONS } from "../utils/sounds";

interface Props {
  reminder: Reminder;
  now: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const accentMap = {
  violet: {
    hsl: "268 92% 68%",
    gradient: "linear-gradient(135deg, hsl(268 92% 68%), hsl(290 95% 70%))",
    ring: "hsl(268 92% 68% / 0.35)",
  },
  cyan: {
    hsl: "195 100% 60%",
    gradient: "linear-gradient(135deg, hsl(195 100% 60%), hsl(220 95% 65%))",
    ring: "hsl(195 100% 60% / 0.35)",
  },
  pink: {
    hsl: "330 90% 65%",
    gradient: "linear-gradient(135deg, hsl(330 90% 65%), hsl(290 95% 70%))",
    ring: "hsl(330 90% 65% / 0.35)",
  },
  emerald: {
    hsl: "152 76% 56%",
    gradient: "linear-gradient(135deg, hsl(152 76% 56%), hsl(180 80% 55%))",
    ring: "hsl(152 76% 56% / 0.35)",
  },
  amber: {
    hsl: "38 95% 60%",
    gradient: "linear-gradient(135deg, hsl(38 95% 60%), hsl(20 95% 60%))",
    ring: "hsl(38 95% 60% / 0.35)",
  },
};

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

function ToggleSwitch({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      className={`switch ${checked ? "checked" : ""}`}
      onClick={onChange}
      aria-pressed={checked}
    >
      <span className="switch-thumb" />
    </button>
  );
}

export function ReminderCard({
  reminder,
  now,
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
}: Props) {
  const accent = accentMap[reminder.accent];
  const sound = SOUND_OPTIONS.find((s) => s.id === reminder.sound);
  const remaining = reminder.active ? reminder.nextTrigger - now : 0;

  return (
    <div
      className="reminder-card glass"
      style={{
        boxShadow: reminder.active
          ? `0 0 0 1px ${accent.ring}, 0 10px 40px -20px ${accent.ring}`
          : undefined,
      }}
    >
      <div
        className="reminder-glow"
        style={{ background: accent.gradient }}
      />

      <div className="reminder-card-inner">
        <div
          className={`reminder-avatar ${reminder.active ? "pulse-ring" : ""}`}
          style={{
            background: accent.gradient,
          }}
        >
          <span>{reminder.emoji}</span>
        </div>

        <div className="reminder-main">
          <div className="reminder-header-row">
            <div className="reminder-texts">
              <h3>{reminder.name}</h3>
              <p>{reminder.message}</p>
            </div>

            <ToggleSwitch checked={reminder.active} onChange={onToggle} />
          </div>

          <div className="reminder-tags">
            <span className="tag">
              <Bell size={12} />
              {formatInterval(reminder.interval, reminder.unit)}
            </span>

            <span className="tag">{sound?.label ?? reminder.sound}</span>

            {reminder.vibration && (
              <span className="tag">
                <Vibrate size={12} />
              </span>
            )}
          </div>

          <div className="reminder-footer-row">
            <div className="reminder-next">
              {reminder.active ? (
                <span>
                  Próximo:{" "}
                  <strong style={{ color: `hsl(${accent.hsl})` }}>
                    {formatCountdown(remaining)}
                  </strong>
                </span>
              ) : (
                <span className="paused-label">
                  <BellOff size={12} />
                  Pausado
                </span>
              )}
            </div>

            <div className="card-actions">
              <button className="icon-btn" onClick={onDuplicate} title="Duplicar">
                <Copy size={16} />
              </button>
              <button className="icon-btn" onClick={onEdit} title="Editar">
                <Pencil size={16} />
              </button>
              <button className="icon-btn danger" onClick={onDelete} title="Eliminar">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}