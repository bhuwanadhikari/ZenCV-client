import { useEffect, useState } from "react";
import { Download } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cvData } from "../../constants/cvData";
import { cvTemplateStyles } from "../../constants/cvStyles";
import { useCV } from "../../hooks/useCV";

const CV_PREVIEW_SKELETON_DELAY_MS = 700;

const toolbarStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "12px",
};

const errorStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "12px",
  color: "#be123c",
};

const buttonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  borderRadius: "999px",
  border: "1px solid #a5f3fc",
  background: "#ecfeff",
  padding: "8px 10px",
  marginTop: "8px",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  position: "relative",
  // top: "12px",
  color: "#155e75",
  cursor: "pointer",
};

const disabledButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  opacity: 0.7,
  cursor: "not-allowed",
};

const previewViewportStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflow: "auto",
  marginTop: "8px",
};

type CvTabBodyProps = {
  pageTitleFirstWord?: string;
};

export function CvTabBody({ pageTitleFirstWord = "" }: CvTabBodyProps) {
  const {
    previewViewportRef,
    cvTemplateRef,
    previewZoom,
    downloadError,
    handleDownloadPdf,
    isDownloading,
  } = useCV(pageTitleFirstWord);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsPreviewLoading(false);
    }, CV_PREVIEW_SKELETON_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div ref={previewViewportRef} style={previewViewportStyle}>
        {isPreviewLoading ? (
          <CvPreviewSkeleton />
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
              <h1 className="cv-document__name">{cvData.name}</h1>
              <div className="cv-document__role">{cvData.role}</div>
              {cvData.contactLines.map((line, lineIndex) => (
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
                <strong>{cvData.profile.label}:</strong> {cvData.profile.summary}
              </p>

              <div className="cv-document__section-title">Skills</div>
              {cvData.skillGroups.map((skillGroup) => (
                <p key={skillGroup.label} className="cv-document__skill-line">
                  <strong>{skillGroup.label}:</strong>{" "}
                  {skillGroup.items.join(", ")}
                </p>
              ))}

              {cvData.sections.map((section) => (
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
                      {entry.stack ? (
                        <p className="cv-document__stack">
                          [{entry.stack.join(", ")}]
                        </p>
                      ) : null}
                      <p className="cv-document__org-line">
                        <em>{entry.organization}</em> | {entry.location}
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

      <div style={toolbarStyle}>
        {isPreviewLoading ? (
          <Skeleton className="h-10 w-36 rounded-full" />
        ) : (
          <>
            {downloadError ? <p style={errorStyle}>{downloadError}</p> : null}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              style={isDownloading ? disabledButtonStyle : buttonStyle}
            >
              <Download size={16} />
              {isDownloading ? "Opening Print" : "Save as PDF"}
            </button>
          </>
        )}
      </div>
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
