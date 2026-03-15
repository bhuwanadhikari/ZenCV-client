import { useEffect, useState } from "react";
import {
  ClipboardList,
  FileText,
  LoaderCircle,
  Settings2,
  Sparkles,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePopupStore, type PopupTab } from "@/store/use-popup-store";

const samplePdfByTab: Partial<
  Record<PopupTab, { src: string; title: string }>
> = {
  "cover-letter": {
    src: "/samples/cover-letter-sample.pdf#toolbar=0&navpanes=0&scrollbar=0",
    title: "Cover letter sample PDF",
  },
  cv: {
    src: "/samples/cv-sample.pdf#toolbar=0&navpanes=0&scrollbar=0",
    title: "CV sample PDF",
  },
};

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
    label: "Setting",
    icon: Settings2,
    title: "Extension Settings",
  },
];

export default function App() {
  const activeTab = usePopupStore((state) => state.activeTab);
  const setActiveTab = usePopupStore((state) => state.setActiveTab);
  const activeItem =
    tabItems.find(({ value }) => value === activeTab) ?? tabItems[0];
  const activeSamplePdf = samplePdfByTab[activeItem.value];
  const [pageText, setPageText] = useState("");
  const [pageTextStatus, setPageTextStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [pageTextError, setPageTextError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadPageText = async () => {
      setPageTextStatus("loading");
      setPageTextError("");

      try {
        if (!chrome?.tabs?.query) {
          throw new Error(
            "Chrome tab APIs are unavailable. Open this UI from the installed extension instead of the regular Vite web page."
          );
        }

        const [activeTab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (!activeTab?.id) {
          throw new Error("No active tab found.");
        }

        if (!chrome?.scripting?.executeScript) {
          throw new Error(
            "The Chrome scripting API is unavailable in this context. Reload the built extension and make sure the manifest includes the 'scripting' permission."
          );
        }

        const [{ result }] = await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: () => document.body?.innerText?.trim() ?? "",
        });

        if (cancelled) {
          return;
        }

        setPageText(result || "No readable text was found on this page.");
        setPageTextStatus("ready");
      } catch (error) {
        if (cancelled) {
          return;
        }

        setPageText("");
        setPageTextStatus("error");
        setPageTextError(
          error instanceof Error
            ? error.message
            : "Unable to read the current page."
        );
      }
    };

    void loadPageText();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="flex min-h-[420px] w-[720px] items-center justify-center p-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as PopupTab)}
        orientation="vertical"
        className="grid h-[560px] w-full grid-cols-[190px_minmax(0,1fr)] gap-4 rounded-[28px] border border-white/40 bg-white/65 p-4 shadow-panel backdrop-blur-sm"
      >
        <div className="flex h-full flex-col gap-4">
          <div className="rounded-2xl bg-card/80 p-4 pb-1">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              IntelliCV
            </p>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[1fr]">
            <TabsList aria-label="Popup sections" className="h-full">
              {tabItems.map(({ value, label, icon: Icon }) => (
                <TabsTrigger key={value} value={value} className="gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="min-h-0">
          <TabsContent
            key={activeItem.value}
            value={activeItem.value}
            className="flex h-full min-h-0 flex-col overflow-y-auto"
          >
            <div>
              <h2 className="mt-0 text-2xl font-semibold">{activeItem.title}</h2>
            </div>

            {activeItem.value === "job-description" ? (
              <div className="mt-3">
                {pageTextStatus === "loading" ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Reading text from the active tab...
                  </div>
                ) : null}

                {pageTextStatus === "error" ? (
                  <p className="text-sm text-muted-foreground">{pageTextError}</p>
                ) : null}

                {pageTextStatus === "ready" ? (
                  <div className="overflow-y-auto rounded-lg border border-border bg-background/80 p-3">
                    <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
                      {pageText}
                    </pre>
                  </div>
                ) : null}
              </div>
            ) : null}

            {activeSamplePdf ? (
              <div className="mt-6 grid min-h-[320px] flex-1 gap-3 rounded-2xl bg-secondary/65 p-4">
                <div className="overflow-hidden rounded-xl border border-border bg-background/80">
                  <iframe
                    src={activeSamplePdf.src}
                    title={activeSamplePdf.title}
                    className="h-full min-h-0 w-full border-0"
                  />
                </div>
              </div>
            ) : activeItem.value !== "job-description" ? (
              <div className="mt-6 grid gap-3 rounded-2xl bg-secondary/65 p-4">
                <div className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Workspace
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    This area is ready for your next step: forms, generated
                    text, upload actions, or extension controls.
                  </p>
                </div>
              </div>
            ) : null}
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
