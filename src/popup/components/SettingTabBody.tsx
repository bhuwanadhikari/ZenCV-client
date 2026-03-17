export function SettingTabBody() {
  return (
    <div className="mt-6 grid min-h-0 flex-1 content-start gap-3 overflow-y-auto rounded-2xl bg-secondary/65 p-4">
      <div className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Workspace
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          This area is ready for your next step: forms, generated text, upload
          actions, or extension controls.
        </p>
      </div>
    </div>
  );
}
