"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Resource = {
  id: number;
  title: string;
  description: string;
  tag: string;
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/resources");
        if (!res.ok) return;
        const data = (await res.json()) as Resource[];
        setResources(data);
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  const persist = async (next: Resource[]) => {
    setResources(next);
    setSaving(true);
    try {
      await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
    } finally {
      setSaving(false);
    }
  };

  const addResource = async () => {
    if (!title.trim()) return;
    const next: Resource[] = [
      {
        id: Date.now(),
        title: title.trim(),
        description: description || "No description",
        tag: tag || "General",
      },
      ...resources,
    ];
    setTitle("");
    setDescription("");
    setTag("");
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
        <h1 className="text-2xl font-semibold tracking-tight">Resources</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Save the links, notes, and tools you actually use.
        </p>
      </header>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-xs text-neutral-300">
        <p className="font-medium text-neutral-100">Add a resource</p>
        <div className="mt-3 grid gap-2 md:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_minmax(0,.8fr)]">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-neutral-800 bg-black/40 px-2 py-1 text-neutral-100 outline-none focus:border-neutral-500"
          />
          <input
            type="text"
            placeholder="Short description or URL"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-lg border border-neutral-800 bg-black/40 px-2 py-1 text-neutral-100 outline-none focus:border-neutral-500"
          />
          <input
            type="text"
            placeholder="Tag (e.g. Notion)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="rounded-lg border border-neutral-800 bg-black/40 px-2 py-1 text-neutral-100 outline-none focus:border-neutral-500"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => void addResource()}
          disabled={saving}
          className="mt-3 rounded-full bg-white px-4 py-1.5 text-[11px] font-medium text-black shadow-lg shadow-white/10 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Saving…" : "Add resource"}
        </motion.button>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.07 } },
        }}
      >
        {resources.map((r) => (
          <motion.div
            key={r.id}
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -3, scale: 1.01 }}
            className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-800/80 px-3 py-1 text-[10px] uppercase tracking-wide text-neutral-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              {r.tag}
            </div>
            <h2 className="mt-3 text-sm font-medium text-neutral-100">
              {r.title}
            </h2>
            <p className="mt-1 text-xs text-neutral-400">{r.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

