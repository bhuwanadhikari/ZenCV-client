import { LoaderCircle, RefreshCw } from "lucide-react";

import { useJd } from "@/popup/job-description/hooks/useJd";

export function JobDescriptionTabBody() {
  const {
    endpoint,
    isProcessingJobDescription,
    isReadingPageHtml,
    isRetryDisabled,
    jobDescription,
    jobDescriptionError,
    jobDescriptionStatus,
    retry,
  } = useJd();

  return (
    <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/70 px-3 py-2">
        <div className="min-w-0">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            POST
          </p>
          <p className="m-0 truncate text-sm text-foreground">
            {getEndpointPath(endpoint)}
          </p>
        </div>
        <button
          type="button"
          onClick={retry}
          disabled={isRetryDisabled}
          aria-label={
            isProcessingJobDescription
              ? "Retry job description processing in progress"
              : "Retry job description processing"
          }
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-800 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessingJobDescription ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </button>
      </div>

      {isReadingPageHtml ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Reading HTML from the active tab...
        </div>
      ) : null}

      {!isReadingPageHtml && jobDescriptionStatus === "loading" ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Processing page HTML into job description text...
        </div>
      ) : null}

      {jobDescriptionStatus === "error" ? (
        <p className="text-sm text-muted-foreground">{jobDescriptionError}</p>
      ) : null}

      {jobDescriptionStatus === "ready" ? (
        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-border bg-background/80 p-3">
          <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
            {jobDescription}
          </pre>
        </div>
      ) : null}
    </div>
  );
}

function getEndpointPath(endpoint: string) {
  try {
    const parsedEndpoint = new URL(endpoint);
    return `${parsedEndpoint.pathname}${parsedEndpoint.search}`;
  } catch {
    return endpoint;
  }
}
