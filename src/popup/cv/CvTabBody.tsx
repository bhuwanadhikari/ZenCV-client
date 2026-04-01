import { useState } from "react";
import { Download } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { GenerationStatusBar } from "@/popup/components/GenerationStatusBar";
import { cvTemplates, type CvTemplateId } from "./cv-templates/cvTemplates";
import {
  contentErrorStyle,
  errorStyle,
  previewViewportStyle,
} from "./styles/cvStyles";
import { useCv } from "./hooks/useCv";

export function CvTabBody() {
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<CvTemplateId>("template-1");
  const {
    cvTemplateRef,
    downloadError,
    endpoint,
    generatedCv,
    generationStatus,
    handleDownloadPdf,
    handleRetry,
    isDownloading,
    isRetryDisabled,
    isRetrying,
    previewErrorMessage,
    previewViewportRef,
    previewZoom,
    shouldShowPreviewSkeleton,
    toolbarErrorMessage,
  } = useCv();
  const selectedTemplate =
    cvTemplates.find((template) => template.id === selectedTemplateId) ??
    cvTemplates[0];
  const SelectedTemplateComponent = selectedTemplate.component;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <GenerationStatusBar
        endpoint={endpoint}
        status={generationStatus}
        onRetry={handleRetry}
        retryLabel="Retry CV generation"
        extraAction={
          generatedCv ? (
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              aria-label={isDownloading ? "Opening Print" : "Save as PDF"}
              title={isDownloading ? "Opening Print" : "Save as PDF"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-800 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={14} />
              <span className="sr-only">
                {isDownloading ? "Opening Print" : "Save as PDF"}
              </span>
            </button>
          ) : null
        }
        retryDisabled={isRetryDisabled}
        isRetrying={isRetrying}
      />
      {downloadError ? <p style={errorStyle}>{downloadError}</p> : null}

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {cvTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => setSelectedTemplateId(template.id)}
            className={cn(
              "inline-flex shrink-0 flex-col items-start rounded-xl text-[11px] border px-2 py-1 text-left transition",
              template.id === selectedTemplateId
                ? "border-cyan-300 bg-cyan-50 text-cyan-900 shadow-sm"
                : "border-slate-200 bg-white/80 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
            )}
            aria-pressed={template.id === selectedTemplateId}
            title={template.description}
          >
            <span className="text-[9px] font-semibold  uppercase tracking-[0.2em]">
              {template.label}
            </span>
          </button>
        ))}
      </div>

      <div ref={previewViewportRef} style={previewViewportStyle}>
        {shouldShowPreviewSkeleton ? (
          <CvPreviewSkeleton />
        ) : !generatedCv ? (
          <p style={contentErrorStyle}>{previewErrorMessage}</p>
        ) : (
          <SelectedTemplateComponent
            ref={cvTemplateRef}
            cv={generatedCv}
            previewZoom={previewZoom}
          />
        )}
      </div>
      {!shouldShowPreviewSkeleton && !generatedCv ? (
        <p style={errorStyle}>{toolbarErrorMessage}</p>
      ) : null}
    </div>
  );
}

function CvPreviewSkeleton() {
  return (
    <div className="flex min-h-full items-start justify-center px-3 pb-4">
      <div className="flex w-full max-w-[820px] flex-col gap-5 rounded-[28px] border border-slate-200/80 bg-white/85 p-6 shadow-sm">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-2/5" />
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <Skeleton className="h-px w-full" />

        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-10/12" />
        </div>

        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
        </div>

        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
