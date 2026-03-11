// Shared type for mood + sleep + notes stored per day

export type DailyLog = {
  // ISO date string, e.g. "2026-03-12"
  date: string;
  mood: number; // 1-5
  stress: number; // 1-5
  energy: number; // 1-5
  note: string;
  sleepHours: number; // hours of sleep for that night
};

