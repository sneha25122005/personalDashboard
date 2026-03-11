"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { DailyLog } from "@/types/DailyLog";
import {
  Dashboard,
  Analytics,
  Calendar,
  Folder,
  Task,
  UserMultiple,
  DocumentAdd,
} from "@carbon/icons-react";

const cards = [
  {
    id: "mood",
    title: "Mood & Mind",
    description: "Track mood, stress, and energy with quick sliders.",
    href: "/mood",
    icon: <UserMultiple size={22} />,
  },
  {
    id: "sleep",
    title: "Sleep",
    description: "Log sleep hours and see your weekly rhythm.",
    href: "/sleep",
    icon: <Calendar size={22} />,
  },
  {
    id: "academics",
    title: "Academics",
    description: "Assignments, exams, and focus time in one place.",
    href: "/academics",
    icon: <Folder size={22} />,
  },
  {
    id: "tasks",
    title: "Tasks",
    description: "Daily to‑dos with priority and focus mode.",
    href: "/tasks",
    icon: <Task size={22} />,
  },
  {
    id: "finance",
    title: "Finance",
    description: "Simple overview of spending, savings, and goals.",
    href: "/finance",
    icon: <Analytics size={22} />,
  },
  {
    id: "resources",
    title: "Resources",
    description: "Quick access to useful links, notes, and files.",
    href: "/resources",
    icon: <DocumentAdd size={22} />,
  },
];

export default function Home() {
  const router = useRouter();

  const [summary, setSummary] = useState<{
    latestMood?: number;
    avgSleep?: number;
    todayTasks?: number;
    savingsPct?: number;
  }>({});

  useEffect(() => {
    const load = async () => {
      try {
        const [dailyRes, tasksRes, financeRes] = await Promise.all([
          fetch("/api/daily"),
          fetch("/api/tasks"),
          fetch("/api/finance"),
        ]);

        const logs = dailyRes.ok
          ? ((await dailyRes.json()) as DailyLog[])
          : [];
        const tasks = tasksRes.ok ? ((await tasksRes.json()) as any[]) : [];
        const finance = financeRes.ok ? await financeRes.json() : null;

        const sortedLogs = logs
          .slice()
          .sort((a, b) => a.date.localeCompare(b.date));
        const latest = sortedLogs.at(-1);
        const last7 = sortedLogs.slice(-7);
        const avgSleep =
          last7.length > 0
            ? Math.round(
                (last7.reduce((s, l) => s + (l.sleepHours || 0), 0) /
                  last7.length) *
                  10,
              ) / 10
            : undefined;

        const todayISO = new Date().toISOString().slice(0, 10);
        const todayTasks = tasks.filter(
          (t) => t.category === "today",
        ).length as number;

        setSummary({
          latestMood: latest?.mood,
          avgSleep,
          todayTasks,
          savingsPct: finance?.savings,
        });
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-10">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-4 py-1 text-xs text-neutral-300">
          <Dashboard size={14} />
          Personal Operating System
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Your personal dashboard
        </h1>
        <p className="max-w-xl text-sm text-neutral-400">
          Mood, sleep, tasks, money, and study — beautifully organized in a
          single place so you can focus on what matters today.
        </p>
      </motion.header>

      <motion.section
        className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.06,
            },
          },
        }}
      >
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => router.push(card.href)}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex h-full flex-col items-start rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-left shadow-sm ring-0 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-neutral-800/80 px-3 py-1 text-xs text-neutral-300">
              <span className="text-neutral-100">{card.icon}</span>
              <span className="capitalize">{card.id}</span>
            </div>

            <h2 className="text-base font-semibold text-white">
              {card.title}
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              {card.description}
            </p>

            <motion.span
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-neutral-300"
              whileHover={{ x: 2 }}
            >
              Open {card.id}
              <span className="text-neutral-500 group-hover:text-neutral-300">
                ↗
              </span>
            </motion.span>
          </motion.button>
        ))}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-xs text-neutral-300"
      >
        <p className="font-medium text-neutral-100">Today at a glance</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-4">
          <div>
            <p className="text-neutral-400">Mood</p>
            <p className="mt-1 text-lg font-semibold text-neutral-50">
              {summary.latestMood !== undefined
                ? `${summary.latestMood}/5`
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-neutral-400">Avg sleep (7d)</p>
            <p className="mt-1 text-lg font-semibold text-neutral-50">
              {summary.avgSleep !== undefined ? `${summary.avgSleep}h` : "—"}
            </p>
          </div>
          <div>
            <p className="text-neutral-400">Today&apos;s tasks</p>
            <p className="mt-1 text-lg font-semibold text-neutral-50">
              {summary.todayTasks ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-neutral-400">Savings plan</p>
            <p className="mt-1 text-lg font-semibold text-neutral-50">
              {summary.savingsPct !== undefined
                ? `${summary.savingsPct}%`
                : "—"}
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
