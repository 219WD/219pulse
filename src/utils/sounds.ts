import type { SoundId } from "../types";

export interface SoundOption {
  id: SoundId;
  label: string;
  description: string;
}

export const SOUND_OPTIONS: SoundOption[] = [
  { id: "chime", label: "Chime", description: "Campanilla cristalina" },
  { id: "water", label: "Agua", description: "Gota suave" },
  { id: "bell", label: "Bell", description: "Campana cálida" },
  { id: "pulse", label: "Pulse", description: "Latido digital" },
  { id: "digital", label: "Digital", description: "Beep moderno" },
  { id: "soft", label: "Soft", description: "Tono envolvente" },
];

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!ctx) {
    const AC = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }

  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  return ctx;
}

interface Note {
  freq: number;
  start: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
}

function playNotes(notes: Note[]) {
  const ac = getCtx();
  if (!ac) return;

  const master = ac.createGain();
  master.gain.value = 0.0001;
  master.connect(ac.destination);

  const now = ac.currentTime;
  master.gain.exponentialRampToValueAtTime(0.6, now + 0.02);

  notes.forEach((n) => {
    const osc = ac.createOscillator();
    const g = ac.createGain();

    osc.type = n.type ?? "sine";
    osc.frequency.value = n.freq;

    g.gain.value = 0.0001;
    osc.connect(g);
    g.connect(master);

    const t = now + n.start;
    const peak = n.gain ?? 0.5;

    g.gain.exponentialRampToValueAtTime(peak, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + n.duration);

    osc.start(t);
    osc.stop(t + n.duration + 0.05);
  });

  const totalEnd = now + Math.max(...notes.map((n) => n.start + n.duration)) + 0.1;
  master.gain.setValueAtTime(0.6, totalEnd - 0.05);
  master.gain.exponentialRampToValueAtTime(0.0001, totalEnd);
}

export function playSound(id: SoundId) {
  switch (id) {
    case "chime":
      playNotes([
        { freq: 880, start: 0, duration: 0.45, type: "sine", gain: 0.5 },
        { freq: 1320, start: 0.12, duration: 0.5, type: "sine", gain: 0.4 },
        { freq: 1760, start: 0.25, duration: 0.6, type: "sine", gain: 0.3 },
      ]);
      break;
    case "water":
      playNotes([
        { freq: 1200, start: 0, duration: 0.18, type: "sine", gain: 0.4 },
        { freq: 700, start: 0.08, duration: 0.35, type: "sine", gain: 0.45 },
        { freq: 500, start: 0.18, duration: 0.5, type: "sine", gain: 0.3 },
      ]);
      break;
    case "bell":
      playNotes([
        { freq: 660, start: 0, duration: 0.9, type: "triangle", gain: 0.55 },
        { freq: 990, start: 0.02, duration: 0.7, type: "sine", gain: 0.35 },
        { freq: 1320, start: 0.04, duration: 0.5, type: "sine", gain: 0.2 },
      ]);
      break;
    case "pulse":
      playNotes([
        { freq: 220, start: 0, duration: 0.12, type: "sine", gain: 0.6 },
        { freq: 220, start: 0.18, duration: 0.12, type: "sine", gain: 0.6 },
        { freq: 330, start: 0.36, duration: 0.18, type: "sine", gain: 0.5 },
      ]);
      break;
    case "digital":
      playNotes([
        { freq: 1046, start: 0, duration: 0.1, type: "square", gain: 0.35 },
        { freq: 1318, start: 0.12, duration: 0.1, type: "square", gain: 0.35 },
        { freq: 1568, start: 0.24, duration: 0.18, type: "square", gain: 0.35 },
      ]);
      break;
    case "soft":
      playNotes([
        { freq: 392, start: 0, duration: 0.6, type: "sine", gain: 0.5 },
        { freq: 523, start: 0.15, duration: 0.6, type: "sine", gain: 0.45 },
        { freq: 659, start: 0.3, duration: 0.7, type: "sine", gain: 0.4 },
      ]);
      break;
  }
}

export function vibrate(pattern: number | number[] = [120, 60, 120]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // noop
    }
  }
}