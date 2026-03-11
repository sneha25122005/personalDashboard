"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Task = {
  id: number;
  title: string;
  category: "today" | "upcoming" | "completed";
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) return;
        const data = (await res.json()) as Task[];
        setTasks(data);
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  const persist = async (next: Task[]) => {
    setTasks(next);
    setSaving(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
    } finally {
      setSaving(false);
    }
  };

  const addTask = async () => {
    if (!input.trim()) return;
    const next: Task[] = [
      { id: Date.now(), title: input.trim(), category: "today" },
      ...tasks,
    ];
    setInput("");
    await persist(next);
  };

  const moveTask = async (id: number, category: Task["category"]) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, category } : t));
    await persist(next);
  };

  const renderTasks = (category: Task["category"]) => (
    <AnimatePresence>
      {tasks
        .filter((t) => t.category === category)
        .map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2.5 text-sm"
          >
            <span className="text-neutral-100">{task.title}</span>
            <div className="flex gap-1.5 text-[10px]">
              {category !== "today" && (
                <button
                  onClick={() => void moveTask(task.id, "today")}
                  className="rounded-full bg-neutral-800 px-2 py-1 text-neutral-200"
                >
                  Today
                </button>
              )}
              {category !== "upcoming" && (
                <button
                  onClick={() => void moveTask(task.id, "upcoming")}
                  className="rounded-full bg-neutral-800 px-2 py-1 text-neutral-200"
                >
                  Upcoming
                </button>
              )}
              {category !== "completed" && (
                <button
                  onClick={() => void moveTask(task.id, "completed")}
                  className="rounded-full bg-white px-2 py-1 text-black"
                >
                  Done
                </button>
              )}
            </div>
          </motion.div>
        ))}
    </AnimatePresence>
  );

  const todayCount = tasks.filter((t) => t.category === "today").length;
  const upcomingCount = tasks.filter((t) => t.category === "upcoming").length;
  const completedCount = tasks.filter((t) => t.category === "completed").length;
  const totalCount = tasks.length;

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Capture what matters today, keep upcoming work visible, and celebrate
          completed tasks.
        </p>
      </header>

      <div className="grid gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 text-xs text-neutral-300 sm:grid-cols-4">
        <div>
          <p className="text-neutral-400">Today</p>
          <p className="mt-1 text-lg font-semibold text-neutral-50">
            {todayCount}
          </p>
        </div>
        <div>
          <p className="text-neutral-400">Upcoming</p>
          <p className="mt-1 text-lg font-semibold text-neutral-50">
            {upcomingCount}
          </p>
        </div>
        <div>
          <p className="text-neutral-400">Completed</p>
          <p className="mt-1 text-lg font-semibold text-neutral-50">
            {completedCount}
          </p>
        </div>
        <div>
          <p className="text-neutral-400">Total tasks</p>
          <p className="mt-1 text-lg font-semibold text-neutral-50">
            {totalCount}
          </p>
        </div>
      </div>

      <motion.div
        className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void addTask()}
            placeholder="Type a new task and press Enter…"
            className="flex-1 rounded-xl border border-neutral-800 bg-black/40 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500"
          />
          <motion.button
            type="button"
            onClick={() => void addTask()}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.96 }}
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black shadow-lg shadow-white/10"
          >
            {saving ? "Saving…" : "Add task"}
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="grid gap-5 md:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
      >
        <motion.section
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4"
        >
          <h2 className="text-sm font-medium text-neutral-100">Today</h2>
          {renderTasks("today")}
        </motion.section>

        <motion.section
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4"
        >
          <h2 className="text-sm font-medium text-neutral-100">Upcoming</h2>
          {renderTasks("upcoming")}
        </motion.section>

        <motion.section
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/20 p-4"
        >
          <h2 className="text-sm font-medium text-neutral-100">Completed</h2>
          {renderTasks("completed")}
        </motion.section>
      </motion.div>
    </motion.div>
  );
}

