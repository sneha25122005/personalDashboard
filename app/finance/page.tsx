"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type FinanceForm = {
  monthLabel: string;
  essentials: number;
  wants: number;
  savings: number;
  totalAmount: number;
};

const defaultFinance: FinanceForm = {
  monthLabel: "",
  essentials: 40,
  wants: 35,
  savings: 25,
  totalAmount: 0,
};

export default function FinancePage() {
  const [finance, setFinance] = useState<FinanceForm>(defaultFinance);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/finance");
        if (!res.ok) return;
        const data = await res.json();
        if (data) {
          setFinance(data as FinanceForm);
        }
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  const handleChange =
    (field: keyof FinanceForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "monthLabel" ? e.target.value : Number(e.target.value || 0);
      setFinance((prev) => ({ ...prev, [field]: value }));
    };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finance),
      });
    } finally {
      setSaving(false);
    }
  };

  const sampleSpending = [
    { label: "Essentials", value: finance.essentials, color: "bg-emerald-500" },
    { label: "Wants", value: finance.wants, color: "bg-indigo-500" },
    { label: "Savings", value: finance.savings, color: "bg-amber-500" },
  ];

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Finance</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Enter how you want to split your money and we&apos;ll visualize it.
        </p>
      </header>

      <motion.section
        className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <h2 className="text-sm font-medium text-neutral-100">
            Spending breakdown
          </h2>

          <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-neutral-800">
            <div className="flex h-full w-full">
              {sampleSpending.map((item, i) => (
                <motion.div
                  key={item.label}
                  className={item.color}
                  style={{
                    width: `${item.value}%`,
                    transformOrigin: "left",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: 0.1 * i,
                    type: "spring",
                    damping: 20,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            {sampleSpending.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${item.color}`}
                  ></span>
                  <span className="text-neutral-200">{item.label}</span>
                </div>
                <span className="text-neutral-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-xs text-neutral-300">
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              This month
            </p>
            <input
              type="text"
              placeholder="e.g. March 2026"
              value={finance.monthLabel}
              onChange={handleChange("monthLabel")}
              className="mt-2 w-full rounded-lg border border-neutral-800 bg-black/40 px-2 py-1 text-xs text-neutral-100 outline-none focus:border-neutral-500"
            />
            <div className="mt-3 flex items-end gap-2">
              <span className="text-2xl font-semibold text-neutral-50">
                ₹{" "}
                <input
                  type="number"
                  value={finance.totalAmount}
                  onChange={handleChange("totalAmount")}
                  className="w-28 rounded-md border border-neutral-800 bg-black/40 px-2 py-1 text-base text-neutral-100 outline-none focus:border-neutral-500"
                />
              </span>
            </div>

            <p className="mt-3 text-xs text-neutral-400">
              Essentials / Wants / Savings (%)
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
              <div className="space-y-1">
                <p className="text-neutral-400">Essentials</p>
                <input
                  type="number"
                  value={finance.essentials}
                  onChange={handleChange("essentials")}
                  className="w-full rounded-md border border-neutral-800 bg-black/40 px-2 py-1 text-neutral-100 outline-none focus:border-neutral-500"
                />
              </div>
              <div className="space-y-1">
                <p className="text-neutral-400">Wants</p>
                <input
                  type="number"
                  value={finance.wants}
                  onChange={handleChange("wants")}
                  className="w-full rounded-md border border-neutral-800 bg-black/40 px-2 py-1 text-neutral-100 outline-none focus:border-neutral-500"
                />
              </div>
              <div className="space-y-1">
                <p className="text-neutral-400">Savings</p>
                <input
                  type="number"
                  value={finance.savings}
                  onChange={handleChange("savings")}
                  className="w-full rounded-md border border-neutral-800 bg-black/40 px-2 py-1 text-neutral-100 outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSave}
              disabled={saving}
              className="mt-4 rounded-full bg-white px-5 py-2 text-xs font-medium text-black shadow-lg shadow-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving…" : "Save finance plan"}
            </motion.button>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 text-xs text-neutral-300">
            <p className="font-medium text-neutral-100">Goals</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Keep savings at or above your chosen %</li>
              <li>Write one line about a big purchase</li>
              <li>Review subscriptions at the end of the month</li>
            </ul>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

