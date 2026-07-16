"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { settingsSections } from "@/config/settings";
import ChangePasswordSection from "@/components/settings/ChangePasswordSection";

const sectionRegistry = {
  security: ChangePasswordSection,
};

export default function SettingsPage() {
  const [activeId, setActiveId] = useState(settingsSections[0]?.id);
  const activeMeta = settingsSections.find((section) => section.id === activeId);
  const ActiveSection = sectionRegistry[activeId];

  return (
    <div className="space-y-6 mx-2 md:mx-6 mx-auto my-2 md:my-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account preferences and security.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        <nav aria-label="Settings sections">
          <ul className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              const isActive = section.id === activeId;

              return (
                <li key={section.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveId(section.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    )}
                  >
                    <Icon size={18} />
                    {section.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <section aria-label={activeMeta?.title}>
          {ActiveSection ? <ActiveSection /> : null}
        </section>
      </div>
    </div>
  );
}
