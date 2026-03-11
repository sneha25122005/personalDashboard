"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { DailyLog } from "@/types/DailyLog";

export default function SleepPage() {
  const [lastWeek, setLastWeek] = useState<number[]>([6.5, 7, 7.5, 6, 8, 7.2, 7.8]);
  const [todayHours, setTodayHours] = useState<number | "">("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/daily");
        if (!res.ok) return;
        const logs = (await res.json()) as DailyLog[];
        const sorted = logs
          .slice()
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-7);
        if (sorted.length) {
          setLastWeek(sorted.map((l) => l.sleepHours || 0));
          const today = sorted.find(
            (l) => l.date === new Date().toISOString().slice(0, 10),
          );
          if (today && typeof today.sleepHours === "number") {
            setTodayHours(today.sleepHours);
          }
        }
      } catch {
        // ignore for now
      }
    };
    load();
  }, []);

  const saveToday = async () => {
    if (todayHours === "") return;
    setSaving(true);
    try {
      const body: Partial<DailyLog> = {
        date: new Date().toISOString().slice(0, 10),
        sleepHours: todayHours,
      };
      await fetch("/api/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } finally {
      setSaving(false);
    }
  };

  const avg =
    Math.round(
      (lastWeek.reduce((sum, h) => sum + h, 0) / lastWeek.length) * 10,
    ) / 10;

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Sleep</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Track your nightly hours and keep your energy steady across the week.
        </p>
      </header>

      <motion.section
        className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <h2 className="text-sm font-medium text-neutral-100">
            Last 7 nights
          </h2>
          <div className="mt-5 flex h-40 items-end gap-3">
            {lastWeek.map((hours, i) => (
              <motion.div
                key={i}
                className="flex flex-1 flex-col items-center gap-1"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.05 * i, type: "spring", damping: 18 }}
                style={{ transformOrigin: "bottom" }}
              >
                <div
                  className="w-full rounded-t-md bg-sky-500"
                  style={{ height: `${hours * 10}px` }}
                />
                <span className="text-[10px] text-neutral-500">
                  {hours.toFixed(1)}h
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              Average
            </p>
            <p className="mt-2 text-3xl font-semibold text-neutral-50">
              {avg}h
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              You&apos;re aiming for 7–9 hours. Nights under 6 hours are
              highlighted above.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 text-xs text-neutral-300">
            <p className="font-medium text-neutral-100">Log today&apos;s sleep</p>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={24}
                step={0.25}
                value={todayHours}
                onChange={(e) =>
                  setTodayHours(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="w-24 rounded-md border border-neutral-800 bg-black/40 px-2 py-1 text-neutral-100 outline-none focus:border-neutral-500"
              />
              <span className="text-neutral-400">hours</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => void saveToday()}
              disabled={saving}
              className="mt-3 rounded-full bg-white px-4 py-1.5 text-[11px] font-medium text-black shadow-lg shadow-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving…" : "Save today&apos;s sleep"}
            </motion.button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

