"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bot, Camera, ClipboardPlus, Sparkles, Upload } from "lucide-react";

type DeliveryMode = "manual" | "photo" | "ai";

const deliveryOptions: {
  id: DeliveryMode;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentClass: string;
  actionLabel: string;
}[] = [
  {
    id: "manual",
    title: "Add Manually",
    subtitle: "Fast and precise",
    description:
      "Enter quantity, price, and delivery date directly when you have values ready.",
    icon: ClipboardPlus,
    accentClass: "from-[#0F766E] to-emerald-500",
    actionLabel: "Start Manual Entry",
  },
  {
    id: "photo",
    title: "Upload Photo",
    subtitle: "Invoice image first",
    description:
      "Upload a bill photo and extract fields from the image before saving your delivery.",
    icon: Camera,
    accentClass: "from-[#B45309] to-amber-500",
    actionLabel: "Upload Delivery Photo",
  },
  {
    id: "ai",
    title: "AI Prompt",
    subtitle: "Natural language input",
    description:
      "Describe delivery details in plain text and let AI prepare structured values.",
    icon: Bot,
    accentClass: "from-[#1D4ED8] to-cyan-500",
    actionLabel: "Create With AI Prompt",
  },
];

export default function ClientSide() {
  const [selectedMode, setSelectedMode] = useState<DeliveryMode>("manual");

  const selectedOption = useMemo(
    () =>
      deliveryOptions.find((option) => option.id === selectedMode) ||
      deliveryOptions[0],
    [selectedMode],
  );

  return (
    <>
      <section className="relative grid grid-cols-1 gap-4 lg:grid-cols-3">
        {deliveryOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = option.id === selectedMode;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedMode(option.id)}
              className={`group rounded-2xl border p-5 text-left transition-all ${
                isSelected
                  ? "border-slate-900 bg-slate-900 text-white shadow-lg dark:border-cyan-300 dark:bg-slate-100 dark:text-slate-900"
                  : "border-slate-200 bg-white/90 text-slate-900 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-[#171B24]/90 dark:text-slate-100 dark:hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${option.accentClass} text-white shadow`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {isSelected && (
                  <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-widest dark:bg-slate-900/10">
                    Selected
                  </span>
                )}
              </div>

              <h2 className="mt-4 text-lg font-bold">{option.title}</h2>
              <p
                className={`mt-1 text-xs ${isSelected ? "text-white/80 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"}`}
              >
                {option.subtitle}
              </p>
              <p
                className={`mt-3 text-sm leading-relaxed ${isSelected ? "text-white/90 dark:text-slate-700" : "text-slate-600 dark:text-slate-300"}`}
              >
                {option.description}
              </p>
            </button>
          );
        })}
      </section>

      <section className="relative rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-sm dark:border-white/10 dark:bg-[#171B24]/95">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Main Delivery Action
            </p>
            <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {selectedOption.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
              {selectedOption.description}
            </p>
          </div>

          <Link
            href={
              selectedMode === "manual"
                ? "/deliveries/manual"
                : selectedMode === "ai"
                  ? "/deliveries/aiPrompt"
                  : "/deliveries/photo"
            }
            className={`inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r px-5 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.01] ${selectedOption.accentClass}`}
          >
            {selectedMode === "manual" && <ClipboardPlus className="h-4 w-4" />}
            {selectedMode === "photo" && <Upload className="h-4 w-4" />}
            {selectedMode === "ai" && <Sparkles className="h-4 w-4" />}
            {selectedOption.actionLabel}
          </Link>
        </div>
      </section>
    </>
  );
}
