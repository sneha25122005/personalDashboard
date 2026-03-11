"use client";

import { motion } from "framer-motion";

const habits = [
  { name: "Read 10 pages", streak: 4 },
  { name: "Drink 2L water", streak: 6 },
  { name: "Move your body", streak: 3 },
];

export default function HabitTracker() {
  return (
    <motion.div
      className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-sm font-medium text-neutral-100">Habits</h2>
      <p className="mt-1 text-xs text-neutral-400">
        Keep tiny promises to yourself and let the streak grow.
      </p>

      <div className="mt-4 space-y-2.5 text-xs">
        {habits.map((habit, i) => (
          <motion.div
            key={habit.name}
            className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <span className="text-neutral-100">{habit.name}</span>
            <span className="rounded-full bg-neutral-800 px-3 py-1 text-[10px] text-neutral-200">
              🔥 {habit.streak}-day streak
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

