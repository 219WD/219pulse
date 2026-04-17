import type { TimeUnit } from "../types";

export function intervalMs(value: number, unit: TimeUnit): number {
  const v = Math.max(1, Math.floor(value));
  return unit === "hours" ? v * 60 * 60 * 1000 : v * 60 * 1000;
}

export function formatInterval(value: number, unit: TimeUnit): string {
  if (unit === "hours") return value === 1 ? "Cada 1 hora" : `Cada ${value} horas`;
  return value === 1 ? "Cada 1 minuto" : `Cada ${value} minutos`;
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "Ahora";

  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}

export function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}