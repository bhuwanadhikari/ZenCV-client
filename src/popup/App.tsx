import { useState } from "react";
import {
  ClipboardList,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  Settings2,
  Sparkles,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { usePopupStore, type PopupTab } from "@/store/use-popup-store";
import { CoverLetterTabBody } from "@/popup/cover-letter/CoverLetterTabBody";
import { CvTabBody } from "@/popup/cv/CvTabBody";
import { JobDescriptionTabBody } from "@/popup/job-description/JobDescriptionTabBody";
import { SettingTabBody } from "@/popup/settings/SettingTabBody";

const tabItems: Array<{
  value: PopupTab;
  label: string;
  icon: typeof Sparkles;
  title: string;
}> = [
  {
    value: "job-description",
    label: "Job Description",
    icon: ClipboardList,
    title: "Job Description",
  },
  {
    value: "cv",
    label: "CV",
    icon: FileText,
    title: "CV Workspace",
  },
  {
    value: "cover-letter",
    label: "Cover Letter",
    icon: Sparkles,
    title: "Cover Letter Workspace",
  },
  {
    value: "setting",
    label: "Settings",
    icon: Settings2,
    title: "Extension Settings",
  },
];

export default function App() {
  const activeTab = usePopupStore((state) => state.activeTab);
  const setActiveTab = usePopupStore((state) => state.setActiveTab);
  const activeItem =
    tabItems.find(({ value }) => value === activeTab) ?? tabItems[0];
  const [isTabBarCollapsed, setIsTabBarCollapsed] = useState(false);

  return (
    <main className="flex h-full w-full overflow-hidden p-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as PopupTab)}
        orientation="vertical"
        className={cn(
          "grid h-full min-h-0 w-full gap-4 overflow-hidden rounded-[28px] border border-white/40 bg-white/65 p-4 shadow-panel backdrop-blur-sm transition-all duration-200",
          isTabBarCollapsed
            ? "grid-cols-[72px_minmax(0,1fr)]"
            : "grid-cols-[176px_minmax(0,1fr)]",
        )}
      >
        <div className="flex h-full min-h-0 flex-col gap-4">
          <div
            className={cn(
              "flex items-center rounded-2xl bg-rose-50/80 p-2 transition-all duration-200",
              isTabBarCollapsed ? "justify-center" : "justify-between gap-3",
            )}
          >
            {!isTabBarCollapsed ? (
              <div className="min-w-0">
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  ZenCV
                </p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setIsTabBarCollapsed((value) => !value)}
              aria-label={
                isTabBarCollapsed ? "Expand tab bar" : "Collapse tab bar"
              }
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background/80 text-muted-foreground transition hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {isTabBarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[1fr]">
            <TabsList aria-label="Popup sections" className="h-full">
              {tabItems.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  aria-label={label}
                  title={label}
                  className={cn(
                    "gap-2",
                    isTabBarCollapsed ? "justify-center px-2" : "",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {!isTabBarCollapsed ? <span>{label}</span> : null}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="flex min-h-0 flex-col">
          <TabsContent
            key={activeItem.value}
            value={activeItem.value}
            className="flex h-full min-h-0 flex-col overflow-hidden"
          >
            <div className="shrink-0">
              <h2 className="mt-0 text-xl font-semibold mb-1">{activeItem.title}</h2>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              {activeItem.value === "job-description" ? <JobDescriptionTabBody /> : null}

              {activeItem.value === "cv" ? (
                <CvTabBody />
              ) : activeItem.value === "cover-letter" ? (
                <CoverLetterTabBody />
              ) : activeItem.value !== "job-description" ? (
                <SettingTabBody />
              ) : null}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
