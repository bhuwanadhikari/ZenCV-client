import { GenerationStatusBar, type GenerationStatus } from "@/popup/components/GenerationStatusBar";
import { useJd } from "@/popup/job-description/hooks/useJd";

export function JobDescriptionTabBody() {
  const {
    endpoint,
    isProcessingJobDescription,
    isReadingPageHtml,
    isRetryDisabled,
    isRetrying,
    jobDescription,
    jobDescriptionError,
    jobDescriptionStatus,
    retry,
  } = useJd();

  const generationStatus: GenerationStatus = jobDescription
    ? "success"
    : isProcessingJobDescription || isReadingPageHtml
      ? "loading"
      : jobDescriptionStatus === "error"
        ? "error"
        : "waiting";

  return (
    <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3">
      <GenerationStatusBar
        endpoint={endpoint}
        status={generationStatus}
        onRetry={retry}
        retryLabel="Retry job description processing"
        showEndpoint={false}
        retryDisabled={isRetryDisabled}
        isRetrying={isRetrying}
      />

      {generationStatus === "error" ? (
        <p className="text-sm text-rose-600">{jobDescriptionError}</p>
      ) : null}

      {generationStatus === "success" ? (
        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-border bg-background/80 p-3">
          <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
            {jobDescription}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
