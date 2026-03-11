"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type AcademicItem = {
  id: number;
  title: string;
  date: string;
  weight: string;
};

export default function AcademicsPage() {
  const [items, setItems] = useState<AcademicItem[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/academics");
        if (!res.ok) return;
        const data = (await res.json()) as AcademicItem[];
        setItems(data);
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  const persist = async (next: AcademicItem[]) => {
    setItems(next);
    setSaving(true);
    try {
      await fetch("/api/academics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
    } finally {
      setSaving(false);
    }
  };

  const addItem = async () => {
    if (!title.trim()) return;
    const next: AcademicItem[] = [
      {
        id: Date.now(),
        title: title.trim(),
        date: date || "No date",
        weight: weight || "—",
      },
      ...items,
    ];
    setTitle("");
    setDate("");
    setWeight("");
    await persist(next);
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Academics</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Add your own assignments, quizzes, and exams to keep them visible.
        </p>
      </header>

      <motion.section
        className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <h2 className="text-sm font-medium text-neutral-100">
            Upcoming deadlines
          </h2>

          <div className="mt-3 grid gap-2 text-xs md:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)_minmax(0,.6fr)]">
            <input
              type="text"
              placeholder="Title (e.g. Algorithms quiz)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border border-neutral-800 bg-black/40 px-2 py-1 text-neutral-100 outline-none focus:border-neutral-500"
            />
            <input
              type="text"
              placeholder="When (e.g. Fri • 10 AM)"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-neutral-800 bg-black/40 px-2 py-1 text-neutral-100 outline-none focus:border-neutral-500"
            />
            <input
              type="text"
              placeholder="Weight (e.g. 10%)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="rounded-lg border border-neutral-800 bg-black/40 px-2 py-1 text-neutral-100 outline-none focus:border-neutral-500"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => void addItem()}
            disabled={saving}
            className="mt-3 rounded-full bg-white px-4 py-1.5 text-[11px] font-medium text-black shadow-lg shadow-white/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving…" : "Add academic item"}
          </motion.button>

          <div className="mt-4 space-y-3 text-xs">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * i }}
                className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2"
              >
                <div>
                  <p className="text-neutral-100">{item.title}</p>
                  <p className="text-[11px] text-neutral-400">{item.date}</p>
                </div>
                <span className="rounded-full bg-neutral-800 px-3 py-1 text-[10px] text-neutral-200">
                  {item.weight}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-xs text-neutral-300">
            <p className="font-medium text-neutral-100">
              Focus for this week
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Finish problem set before the weekend</li>
              <li>Block 2 × 45‑minute deep work sessions</li>
              <li>Summarize each lecture in 3 bullet points</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 text-xs text-neutral-300">
            <p className="font-medium text-neutral-100">
              Tiny rule that helps
            </p>
            <p className="mt-2 text-neutral-400">
              If a task takes under 5 minutes (uploading, renaming files,
              sending a quick email), do it right after the lecture.
            </p>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

