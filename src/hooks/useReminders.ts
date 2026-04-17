import { useCallback, useEffect, useRef, useState } from "react";
import type { ActiveAlert, Reminder, ReminderInput } from "../types";
import { intervalMs } from "../utils/time";
import { playSound, vibrate } from "../utils/sounds";
import { showSystemNotification } from "../utils/notifications";
import { loadReminders, saveReminders } from "../utils/storage";

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(() => loadReminders());
  const [alert, setAlert] = useState<ActiveAlert | null>(null);
  const [now, setNow] = useState(Date.now());

  const remindersRef = useRef(reminders);
  remindersRef.current = reminders;

  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);

  useEffect(() => {
    const tick = () => {
      const t = Date.now();
      setNow(t);

      const due: Reminder[] = [];

      const next = remindersRef.current.map((r) => {
        if (r.active && r.nextTrigger <= t) {
          due.push(r);
          return {
            ...r,
            nextTrigger: t + intervalMs(r.interval, r.unit),
          };
        }
        return r;
      });

      if (due.length > 0) {
        setReminders(next);
        const first = due[0];

        try {
          playSound(first.sound);
        } catch {
          // noop
        }

        if (first.vibration) {
          vibrate([180, 80, 180]);
        }

        showSystemNotification(first.name, first.message, first.emoji);

        setAlert({
          reminder: first,
          triggeredAt: t,
        });
      }
    };

    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const addReminder = useCallback((input: ReminderInput) => {
    const r: Reminder = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: Date.now(),
      nextTrigger: input.active ? Date.now() + intervalMs(input.interval, input.unit) : 0,
    };

    setReminders((prev) => [r, ...prev]);
    return r;
  }, []);

  const updateReminder = useCallback((id: string, input: ReminderInput) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;

        return {
          ...r,
          ...input,
          nextTrigger: input.active ? Date.now() + intervalMs(input.interval, input.unit) : 0,
        };
      })
    );
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;

        const active = !r.active;

        return {
          ...r,
          active,
          nextTrigger: active ? Date.now() + intervalMs(r.interval, r.unit) : 0,
        };
      })
    );
  }, []);

  const duplicateReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const src = prev.find((r) => r.id === id);
      if (!src) return prev;

      const copy: Reminder = {
        ...src,
        id: crypto.randomUUID(),
        name: `${src.name} (copia)`,
        createdAt: Date.now(),
        nextTrigger: src.active ? Date.now() + intervalMs(src.interval, src.unit) : 0,
      };

      return [copy, ...prev];
    });
  }, []);

  const dismissAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return {
    reminders,
    now,
    alert,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    duplicateReminder,
    dismissAlert,
  };
}