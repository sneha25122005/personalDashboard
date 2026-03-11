"use client";

type MoodCardProps = {
  mood: number; // 1 - 5
};

const moodColors = [
  "bg-red-500",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-500",
];

const moodLabels = ["Very Low", "Low", "Okay", "Good", "Excellent"];

export default function MoodCard({ mood }: MoodCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">Mood</h3>

      <div className="mt-3 flex items-center gap-4">
        {/* Visual Bar */}
        <div className="flex flex-1 gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-4 flex-1 rounded ${
                level <= mood ? moodColors[mood - 1] : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Numeric */}
        <div className="text-lg font-semibold">{mood}/5</div>
      </div>

      {/* Label */}
      <p className="mt-2 text-xs text-gray-500">
        {moodLabels[mood - 1]}
      </p>
    </div>
  );
}
