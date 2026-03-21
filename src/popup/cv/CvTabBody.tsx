import { Download } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { GenerationStatusBar } from "@/popup/components/GenerationStatusBar";
import {
  contentErrorStyle,
  cvTemplateStyles,
  errorStyle,
  previewViewportStyle,
} from "./styles/cvStyles";
import { useCv } from "./hooks/useCv";

type CvTabBodyProps = {
  pageTitle?: string;
  pageUrl?: string;
  pageTitleFirstWord?: string;
  pageText?: string;
  pageTextStatus?: "idle" | "loading" | "ready" | "error";
  pageTextError?: string;
};

export function CvTabBody({
  pageTitle = "",
  pageUrl = "",
  pageTitleFirstWord = "",
  pageText = "",
  pageTextStatus = "idle",
  pageTextError = "",
}: CvTabBodyProps) {
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
  } = useCv({
    pageTitle,
    pageUrl,
    pageTitleFirstWord,
    pageText,
    pageTextStatus,
    pageTextError,
  });

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

      <div ref={previewViewportRef} style={previewViewportStyle}>
        {shouldShowPreviewSkeleton ? (
          <CvPreviewSkeleton />
        ) : !generatedCv ? (
          <p style={contentErrorStyle}>{previewErrorMessage}</p>
        ) : (
          <article
            ref={cvTemplateRef}
            className="cv-document cv-document--preview"
            style={
              {
                "--cv-preview-zoom": String(previewZoom),
              } as React.CSSProperties
            }
          >
            <style>{cvTemplateStyles}</style>

            <div className="cv-document__page">
              <h1 className="cv-document__name">{generatedCv.name}</h1>
              <div className="cv-document__role">{generatedCv.role}</div>
              {generatedCv.contactLines.map((line, lineIndex) => (
                <div
                  key={`contact-line-${lineIndex}`}
                  className="cv-document__contact-line"
                >
                  {line.map((item, itemIndex) => (
                    <span key={`${item.label ?? item.value}-${itemIndex}`}>
                      {itemIndex > 0 ? " | " : null}
                      {item.label ? `${item.label}: ` : null}
                      {item.href ? (
                        <a href={item.href}>{item.value}</a>
                      ) : (
                        item.value
                      )}
                    </span>
                  ))}
                </div>
              ))}
              <hr className="cv-document__divider" />

              <p className="cv-document__profile">
                <strong>{generatedCv.profile.label}:</strong>{" "}
                {generatedCv.profile.summary}
              </p>

              <div className="cv-document__section-title">Skills</div>
              {generatedCv.skillGroups.map((skillGroup) => (
                <p key={skillGroup.label} className="cv-document__skill-line">
                  <strong>{skillGroup.label}:</strong>{" "}
                  {skillGroup.items.join(", ")}
                </p>
              ))}

              {generatedCv.sections.map((section) => (
                <div key={section.title}>
                  <div className="cv-document__section-title">{section.title}</div>

                  {section.entries.map((entry) => (
                    <div
                      key={`${entry.title}-${entry.dateRange}`}
                      className="cv-document__entry"
                    >
                      <p className="cv-document__header">
                        <span className="cv-document__date">
                          {entry.dateRange}
                        </span>{" "}
                        |{" "}
                        <span className="cv-document__title">{entry.title}</span>
                      </p>
                      {entry.stack && entry.stack.length > 0 ? (
                        <p className="cv-document__stack">
                          [{entry.stack.join(", ")}]
                        </p>
                      ) : null}
                      <p className="cv-document__org-line">
                        {entry.link ? (
                          <a href={entry.link}>
                            <em>{entry.organization}</em>
                          </a>
                        ) : (
                          <em>{entry.organization}</em>
                        )}{" "}
                        | {entry.location}
                      </p>
                      <ul className="cv-document__list">
                        {entry.bullets.map((bullet, bulletIndex) => (
                          <li key={`${entry.title}-bullet-${bulletIndex}`}>
                            <span className="cv-document__bullet" aria-hidden="true">
                              •
                            </span>
                            <span className="cv-document__bullet-text">
                              {bullet}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </article>
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
