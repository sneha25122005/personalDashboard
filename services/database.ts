// Simple JSON-based storage for personal dashboard data

import { promises as fs } from "fs";
import path from "path";

import type { DailyLog } from "../types/DailyLog";

const DATA_DIR = path.join(process.cwd(), "data");
const DAILY_FILE = path.join(DATA_DIR, "daily.json");
const TASKS_FILE = path.join(DATA_DIR, "tasks.json");
const FINANCE_FILE = path.join(DATA_DIR, "finance.json");
const ACADEMICS_FILE = path.join(DATA_DIR, "academics.json");
const RESOURCES_FILE = path.join(DATA_DIR, "resources.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return fallback;
    }
    console.error("Failed to read JSON", file, error);
    throw error;
  }
}

async function writeJson<T>(file: string, value: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

// ---- Daily logs (mood + sleep + note) ----

export async function getDailyLogs(): Promise<DailyLog[]> {
  return readJson<DailyLog[]>(DAILY_FILE, []);
}

export async function saveDailyLog(entry: DailyLog): Promise<void> {
  const all = await getDailyLogs();
  const index = all.findIndex((log) => log.date === entry.date);
  if (index >= 0) {
    all[index] = entry;
  } else {
    all.push(entry);
  }
  await writeJson(DAILY_FILE, all);
}

// Merge helper for partial updates (e.g. summaries)
export async function updateDailyLog(
  date: string,
  patch: Partial<DailyLog>,
): Promise<DailyLog> {
  const all = await getDailyLogs();
  const index = all.findIndex((log) => log.date === date);

  let merged: DailyLog;
  if (index >= 0) {
    merged = { ...all[index], ...patch, date };
    all[index] = merged;
  } else {
    // If no entry exists yet, create one with safe defaults
    merged = {
      date,
      mood: patch.mood ?? 3,
      stress: patch.stress ?? 3,
      energy: patch.energy ?? 3,
      note: patch.note ?? "",
      sleepHours: patch.sleepHours ?? 0,
      tasksTotal: patch.tasksTotal,
      tasksCompleted: patch.tasksCompleted,
      resourcesCount: patch.resourcesCount,
    };
    all.push(merged);
  }

  await writeJson(DAILY_FILE, all);
  return merged;
}

// ---- Tasks ----

export type TaskItem = {
  id: number;
  title: string;
  category: "today" | "upcoming" | "completed";
};

export async function getTasks(): Promise<TaskItem[]> {
  return readJson<TaskItem[]>(TASKS_FILE, []);
}

export async function saveTasks(tasks: TaskItem[]): Promise<void> {
  await writeJson(TASKS_FILE, tasks);
}

// ---- Finance (single snapshot) ----

export type FinanceSnapshot = {
  monthLabel: string; // e.g. "March 2026"
  essentials: number;
  wants: number;
  savings: number;
  totalAmount: number;
};

export async function getFinance(): Promise<FinanceSnapshot | null> {
  return readJson<FinanceSnapshot | null>(FINANCE_FILE, null);
}

export async function saveFinance(snapshot: FinanceSnapshot): Promise<void> {
  await writeJson(FINANCE_FILE, snapshot);
}

// ---- Academics (upcoming items) ----

export type AcademicItem = {
  id: number;
  title: string;
  date: string;
  weight: string;
};

export async function getAcademics(): Promise<AcademicItem[]> {
  return readJson<AcademicItem[]>(ACADEMICS_FILE, []);
}

export async function saveAcademics(items: AcademicItem[]): Promise<void> {
  await writeJson(ACADEMICS_FILE, items);
}

// ---- Resources ----

export type ResourceItem = {
  id: number;
  title: string;
  description: string;
  tag: string;
};

export async function getResources(): Promise<ResourceItem[]> {
  return readJson<ResourceItem[]>(RESOURCES_FILE, []);
}

export async function saveResources(items: ResourceItem[]): Promise<void> {
  await writeJson(RESOURCES_FILE, items);
}

