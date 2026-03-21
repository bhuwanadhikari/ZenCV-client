import { LoaderCircle } from "lucide-react";

type JobDescriptionTabBodyProps = {
  pageText: string;
  pageTextStatus: "idle" | "loading" | "ready" | "error";
  pageTextError: string;
};

export function JobDescriptionTabBody({
  pageText,
  pageTextStatus,
  pageTextError,
}: JobDescriptionTabBodyProps) {
  return (
    <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3">
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
        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-border bg-background/80 p-3">
          <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
            {pageText}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
