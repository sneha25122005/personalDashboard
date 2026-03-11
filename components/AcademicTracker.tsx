"use client";

import { motion } from "framer-motion";

const courses = [
  { name: "Algorithms", progress: 70 },
  { name: "DBMS", progress: 55 },
  { name: "Operating Systems", progress: 40 },
];

export default function AcademicTracker() {
  return (
    <motion.div
      className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-sm font-medium text-neutral-100">Courses</h2>
      <p className="mt-1 text-xs text-neutral-400">
        Rough completion based on finished modules, assignments, and readings.
      </p>

      <div className="mt-4 space-y-3 text-xs">
        {courses.map((course, i) => (
          <div key={course.name}>
            <div className="flex items-center justify-between">
              <span className="text-neutral-100">{course.name}</span>
              <span className="text-neutral-400">{course.progress}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ delay: 0.08 * i, type: "spring", damping: 18 }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

