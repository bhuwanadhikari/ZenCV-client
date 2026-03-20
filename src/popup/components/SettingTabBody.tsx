import { AI_MODEL_NAME, API_BASE_URL } from "@/lib/api";

export function SettingTabBody() {
  return (
    <div className="mt-6 grid min-h-0 flex-1 content-start gap-3 overflow-y-auto rounded-2xl bg-secondary/65 p-4">
      <div className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          API Config
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          The extension reads these values from your local `.env` file at build
          time.
        </p>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              API Base URL
            </dt>
            <dd className="mt-1 break-all font-medium text-foreground">
              {API_BASE_URL}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              AI Model
            </dt>
            <dd className="mt-1 break-all font-medium text-foreground">
              {AI_MODEL_NAME}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
