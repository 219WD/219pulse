import type { Reminder } from "../types";
import { intervalMs } from "./time";

const STORAGE_KEY = "pulse.reminders.v1";

const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: crypto.randomUUID(),
    name: "Estirar la espalda",
    emoji: "🧘",
    message: "Levantate, respirá profundo y estirá la espalda 30 segundos.",
    interval: 30,
    unit: "minutes",
    sound: "soft",
    vibration: true,
    active: true,
    accent: "violet",
    createdAt: Date.now(),
    nextTrigger: Date.now() + 30 * 60 * 1000,
  },
  {
    id: crypto.randomUUID(),
    name: "Tomar agua",
    emoji: "💧",
    message: "Hidratate. Un vaso de agua ahora hará una gran diferencia.",
    interval: 45,
    unit: "minutes",
    sound: "water",
    vibration: true,
    active: true,
    accent: "cyan",
    createdAt: Date.now(),
    nextTrigger: Date.now() + 45 * 60 * 1000,
  },
];

export function loadReminders(): Reminder[] {
  if (typeof window === "undefined") return DEFAULT_REMINDERS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_REMINDERS;

    const parsed = JSON.parse(raw) as Reminder[];
    if (!Array.isArray(parsed)) return DEFAULT_REMINDERS;

    const now = Date.now();

    return parsed.map((r) => {
      if (!r.active) return r;

      if (!r.nextTrigger || r.nextTrigger < now) {
        return {
          ...r,
          nextTrigger: now + intervalMs(r.interval, r.unit),
        };
      }

      return r;
    });
  } catch {
    return DEFAULT_REMINDERS;
  }
}

export function saveReminders(reminders: Reminder[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  } catch {
    // noop
  }
}