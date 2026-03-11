"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { DailyLog } from "@/types/DailyLog";

const moodColors = [
  "bg-red-500",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-500",
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function MoodPage() {
  const [mood, setMood] = useState(3);
  const [stress, setStress] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [note, setNote] = useState("");
  const [trend, setTrend] = useState<number[]>([2, 3, 4, 3, 5, 4, 3]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/daily");
        if (!res.ok) return;
        const logs = (await res.json()) as DailyLog[];

        const today = logs.find((l) => l.date === todayISO());
        if (today) {
          setMood(today.mood);
          setStress(today.stress);
          setEnergy(today.energy);
          setNote(today.note);
        }

        const last7 = logs
          .slice()
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-7);
        if (last7.length) {
          setTrend(last7.map((l) => l.mood));
        }
      } catch {
        // ignore for now
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: Partial<DailyLog> = {
        date: todayISO(),
        mood,
        stress,
        energy,
        note,
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

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight">
          Mood & mental state
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Quickly log how you feel today and watch your emotional trends over
          time.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-5 md:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.06 },
          },
        }}
      >
        <SliderCard title="Mood" value={mood} setValue={setMood} />
        <SliderCard title="Stress" value={stress} setValue={setStress} />
        <SliderCard title="Energy" value={energy} setValue={setEnergy} />
      </motion.div>

      <motion.div
        className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-sm font-medium text-neutral-200">Mood indicator</h2>

        <div className="mt-4 flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <motion.div
              key={level}
              className={`h-6 flex-1 rounded-md ${
                level <= mood ? moodColors[mood - 1] : "bg-neutral-800"
              }`}
              layout
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />
          ))}
        </div>

        <p className="mt-3 text-xs text-neutral-400">
          Current mood:{" "}
          <span className="font-medium text-neutral-100">{mood}/5</span>
        </p>
      </motion.div>

      <motion.div
        className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <h2 className="text-sm font-medium text-neutral-200">Journal note</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Capture a sentence or two about what influenced your mood.
          </p>
          <textarea
            className="mt-3 w-full rounded-xl border border-neutral-800 bg-black/40 p-3 text-sm text-neutral-100 outline-none ring-0 focus:border-neutral-500"
            rows={4}
            placeholder="Write how you felt today…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <h2 className="text-sm font-medium text-neutral-200">
            Mood trend (last 7 days)
          </h2>
          <div className="mt-5 flex h-32 items-end gap-3">
            {trend.map((m, i) => (
              <motion.div
                key={`${m}-${i}`}
                className="flex flex-1 flex-col items-center gap-1"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.05 * i, type: "spring", damping: 20 }}
                style={{ transformOrigin: "bottom" }}
              >
                <div
                  className={`w-full rounded-t-md ${moodColors[m - 1]}`}
                  style={{ height: `${m * 18}px` }}
                />
                <span className="text-[10px] text-neutral-500">{m}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
      >
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-white px-6 py-2 text-sm font-medium text-black shadow-lg shadow-white/10 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Saving…" : "Save today’s mood"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function SliderCard({
  title,
  value,
  setValue,
}: {
  title: string;
  value: number;
  setValue: (v: number) => void;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0 },
      }}
      className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-100">{title}</h2>
        <span className="text-xs text-neutral-400">{value}/5</span>
      </div>

      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-4 w-full accent-white"
      />
    </motion.div>
  );
}
