export type TimeUnit = "minutes" | "hours";

export type SoundId =
  | "chime"
  | "water"
  | "bell"
  | "pulse"
  | "digital"
  | "soft";

export type AccentColor = "violet" | "cyan" | "pink" | "emerald" | "amber";

export interface Reminder {
  id: string;
  name: string;
  emoji: string;
  message: string;
  interval: number;
  unit: TimeUnit;
  sound: SoundId;
  vibration: boolean;
  active: boolean;
  accent: AccentColor;
  createdAt: number;
  nextTrigger: number;
}

export interface ReminderInput {
  name: string;
  emoji: string;
  message: string;
  interval: number;
  unit: TimeUnit;
  sound: SoundId;
  vibration: boolean;
  active: boolean;
  accent: AccentColor;
}

export interface ActiveAlert {
  reminder: Reminder;
  triggeredAt: number;
}