import { useEffect, useState } from "react";
import { Play, Sparkles, X } from "lucide-react";
import type { AccentColor, Reminder, ReminderInput, SoundId, TimeUnit } from "../types";
import { SOUND_OPTIONS, playSound } from "../utils/sounds";
import { EmojiPicker } from "./EmojiPicker";
import { AccentPicker } from "./AccentPicker";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Reminder | null;
  onSubmit: (input: ReminderInput) => void;
}

const empty: ReminderInput = {
  name: "",
  emoji: "✨",
  message: "",
  interval: 30,
  unit: "minutes",
  sound: "soft",
  vibration: true,
  active: true,
  accent: "violet",
};

export function ReminderForm({ open, onOpenChange, initial, onSubmit }: Props) {
  const [form, setForm] = useState<ReminderInput>(empty);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              name: initial.name,
              emoji: initial.emoji,
              message: initial.message,
              interval: initial.interval,
              unit: initial.unit,
              sound: initial.sound,
              vibration: initial.vibration,
              active: initial.active,
              accent: initial.accent,
            }
          : empty
      );
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Poné un nombre al recordatorio");
      return;
    }

    if (form.interval < 1) {
      alert("El intervalo debe ser mayor a 0");
      return;
    }

    onSubmit({
      ...form,
      name: form.name.trim(),
      message: form.message.trim() || "Es momento de tu recordatorio.",
    });

    onOpenChange(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => onOpenChange(false)}>
      <div className="form-modal glass-strong" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <div>
            <h2>
              <Sparkles size={18} />
              {initial ? "Editar recordatorio" : "Nuevo recordatorio"}
            </h2>
            <p>Diseñá un ritual que te acompañe durante el día.</p>
          </div>

          <button
            className="icon-btn"
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="row top-row">
            <EmojiPicker value={form.emoji} onChange={(emoji) => setForm({ ...form, emoji })} />

            <div className="field grow">
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                placeholder="Ej. Tomar agua"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="message">Mensaje</label>
            <textarea
              id="message"
              placeholder="Lo que verás cuando se active..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
            />
          </div>

          <div className="row two-cols">
            <div className="field">
              <label htmlFor="interval">Intervalo</label>
              <input
                id="interval"
                type="number"
                min={1}
                value={form.interval}
                onChange={(e) =>
                  setForm({ ...form, interval: Number(e.target.value) || 1 })
                }
              />
            </div>

            <div className="field">
              <label htmlFor="unit">Unidad</label>
              <select
                id="unit"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value as TimeUnit })}
              >
                <option value="minutes">Minutos</option>
                <option value="hours">Horas</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="sound">Sonido</label>
            <div className="sound-row">
              <select
                id="sound"
                value={form.sound}
                onChange={(e) => setForm({ ...form, sound: e.target.value as SoundId })}
              >
                {SOUND_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} — {s.description}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="secondary-btn icon-only"
                onClick={() => playSound(form.sound)}
                title="Probar sonido"
              >
                <Play size={16} />
              </button>
            </div>
          </div>

          <div className="field">
            <label>Color de acento</label>
            <AccentPicker
              value={form.accent}
              onChange={(accent: AccentColor) => setForm({ ...form, accent })}
            />
          </div>

          <div className="toggle-list">
            <label className="toggle-card">
              <div>
                <strong>Vibración</strong>
                <small>Si el dispositivo lo permite</small>
              </div>
              <input
                type="checkbox"
                checked={form.vibration}
                onChange={(e) => setForm({ ...form, vibration: e.target.checked })}
              />
            </label>

            <label className="toggle-card">
              <div>
                <strong>Activar al guardar</strong>
                <small>Empieza a contar inmediatamente</small>
              </div>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="ghost-btn" onClick={() => onOpenChange(false)}>
              Cancelar
            </button>

            <button type="submit" className="primary-btn">
              {initial ? "Guardar cambios" : "Crear recordatorio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}