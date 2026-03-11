"use client";

import { motion } from "framer-motion";

type SleepCardProps = {
  hours: number;
};

export default function SleepCard({ hours }: SleepCardProps) {
  const target = 8;
  const percentage = Math.min(100, (hours / target) * 100);

  return (
    <motion.div
      className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-sm font-medium text-neutral-200">Sleep last night</h3>
      <p className="mt-1 text-xs text-neutral-400">Target: {target} hours</p>

      <div className="mt-3 flex items-end gap-4">
        <div className="text-3xl font-semibold text-neutral-50">
          {hours.toFixed(1)}
          <span className="ml-1 text-sm text-neutral-400">h</span>
        </div>
        <div className="flex-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
            <motion.div
              className="h-full rounded-full bg-sky-500"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ type: "spring", damping: 18 }}
            />
          </div>
          <p className="mt-1 text-[11px] text-neutral-400">
            {percentage >= 90
              ? "Great night — your energy will thank you."
              : "A little more sleep will help tomorrow feel smoother."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

