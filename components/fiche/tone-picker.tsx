"use client";

import { cn } from "@/lib/utils";

export type Tone = "critique" | "red" | "amber" | "green";

const TONE_CLASSES: Record<Tone, string> = {
  critique: "border-foreground/30 bg-foreground/10 text-foreground",
  red: "border-red-200 bg-red-50 text-red-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function TonePicker<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; tone: Tone }[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              selected
                ? TONE_CLASSES[opt.tone]
                : "border-border bg-background text-muted-foreground hover:bg-muted",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
