import type { ActiveAlert } from "../types";
import { formatClock } from "../utils/time";

interface Props {
  alert: ActiveAlert | null;
  onDismiss: () => void;
}

const accentMap = {
  violet: "linear-gradient(135deg, hsl(268 92% 68%), hsl(290 95% 70%))",
  cyan: "linear-gradient(135deg, hsl(195 100% 60%), hsl(220 95% 65%))",
  pink: "linear-gradient(135deg, hsl(330 90% 65%), hsl(290 95% 70%))",
  emerald: "linear-gradient(135deg, hsl(152 76% 56%), hsl(180 80% 55%))",
  amber: "linear-gradient(135deg, hsl(38 95% 60%), hsl(20 95% 60%))",
};

export function AlertModal({ alert, onDismiss }: Props) {
  if (!alert) return null;

  const gradient = accentMap[alert.reminder.accent];

  return (
    <div className="modal-backdrop" onClick={onDismiss}>
      <div className="alert-modal glass-strong" onClick={(e) => e.stopPropagation()}>
        <div className="alert-blur" style={{ background: gradient }} />
        <div className="alert-content">
          <div className="alert-emoji" style={{ background: gradient }}>
            {alert.reminder.emoji}
          </div>

          <h2>{alert.reminder.name}</h2>
          <p>{alert.reminder.message}</p>
          <small>{formatClock(alert.triggeredAt)}</small>

          <button className="primary-btn full" onClick={onDismiss}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}