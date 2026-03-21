import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  GENERATE_COVER_LETTER_ENDPOINT,
  getGeneratedCoverLetter,
} from "@/lib/api";
import {
  GenerationStatusBar,
  type GenerationStatus,
} from "@/popup/components/GenerationStatusBar";

const COVER_LETTER_SKELETON_DELAY_MS = 700;

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
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
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

const contentErrorStyle: React.CSSProperties = {
  margin: 0,
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid #fecdd3",
  background: "#fff1f2",
  fontSize: "13px",
  color: "#9f1239",
};

type CoverLetterTabBodyProps = {
  pageTitle?: string;
  pageUrl?: string;
  pageText?: string;
  pageTextStatus?: "idle" | "loading" | "ready" | "error";
  pageTextError?: string;
};

export function CoverLetterTabBody({
  pageTitle = "",
  pageUrl = "",
  pageText = "",
  pageTextStatus = "idle",
  pageTextError = "",
}: CoverLetterTabBodyProps) {
  const canGenerateCoverLetter =
    pageTextStatus === "ready" && pageText.trim().length > 0;
  const {
    data: generatedCoverLetterResponse,
    error: generatedCoverLetterError,
    isPending: isGeneratedCoverLetterPending,
    isFetching: isGeneratedCoverLetterFetching,
    refetch: refetchGeneratedCoverLetter,
  } = useQuery({
    queryKey: ["generated-cover-letter", pageText, pageTitle, pageUrl],
    queryFn: () =>
      getGeneratedCoverLetter({
        jobDescription: pageText,
        job_url: pageUrl,
        page_title: pageTitle,
      }),
    enabled: canGenerateCoverLetter,
  });
  const generatedCoverLetter = generatedCoverLetterResponse?.coverLetter;
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printError, setPrintError] = useState("");
  const isGeneratedCoverLetterLoading =
    canGenerateCoverLetter &&
    (isGeneratedCoverLetterPending || isGeneratedCoverLetterFetching);
  const generationStatus: GenerationStatus = generatedCoverLetter
    ? "success"
    : isGeneratedCoverLetterLoading
      ? "loading"
      : pageTextStatus === "error"
        ? "error"
        : canGenerateCoverLetter
          ? "error"
          : "waiting";
  const shouldShowPreviewSkeleton =
    isPreviewLoading ||
    (canGenerateCoverLetter && isGeneratedCoverLetterPending);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsPreviewLoading(false);
    }, COVER_LETTER_SKELETON_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const handlePrint = useCallback(async () => {
    if (!generatedCoverLetter || isPrinting) {
      return;
    }

    setIsPrinting(true);
    setPrintError("");

    try {
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        throw new Error("The print window was blocked by the browser.");
      }

      printWindow.document.open();
      printWindow.document.write(
        buildPrintDocument(generatedCoverLetter, buildSuggestedPrintTitle(pageTitle)),
      );
      printWindow.document.close();

      if ("fonts" in printWindow.document) {
        await printWindow.document.fonts.ready;
      }

      try {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      } catch (printWindowError) {
        console.error(printWindowError);
      }
    } catch (error) {
      console.error(error);
      setPrintError("Unable to open the print dialog.");
    } finally {
      setIsPrinting(false);
    }
  }, [generatedCoverLetter, isPrinting, pageTitle]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <GenerationStatusBar
        endpoint={GENERATE_COVER_LETTER_ENDPOINT}
        status={generationStatus}
        onRetry={() => {
          void refetchGeneratedCoverLetter();
        }}
        retryLabel="Retry cover letter generation"
        retryDisabled={
          !canGenerateCoverLetter || isGeneratedCoverLetterFetching
        }
        isRetrying={isGeneratedCoverLetterFetching}
      />

      <div style={previewViewportStyle}>
        {shouldShowPreviewSkeleton ? (
          <CoverLetterPreviewSkeleton />
        ) : !canGenerateCoverLetter ? (
          <p style={contentErrorStyle}>
            {pageTextStatus === "error"
              ? pageTextError || "Unable to read the current page text."
              : "Read a job description first to generate the cover letter."}
          </p>
        ) : !generatedCoverLetter ? (
          <p style={contentErrorStyle}>
            {generatedCoverLetterError instanceof Error
              ? generatedCoverLetterError.message
              : "The generated cover letter response is unavailable."}
          </p>
        ) : (
          <article className="rounded-[28px] border border-slate-200/80 bg-white/85 p-6 shadow-sm">
            <p className="m-0 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {generatedCoverLetter}
            </p>
          </article>
        )}
      </div>

      <div style={toolbarStyle}>
        {shouldShowPreviewSkeleton ? (
          <Skeleton className="h-10 w-28 rounded-full" />
        ) : !canGenerateCoverLetter ? (
          <p style={errorStyle}>Job description text is required before printing.</p>
        ) : !generatedCoverLetter ? (
          <p style={errorStyle}>Generate the cover letter before printing.</p>
        ) : (
          <>
            {printError ? <p style={errorStyle}>{printError}</p> : null}
            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              style={isPrinting ? disabledButtonStyle : buttonStyle}
            >
              <Download size={16} />
              {isPrinting ? "Opening Print" : "Print"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function CoverLetterPreviewSkeleton() {
  return (
    <div className="flex min-h-full flex-col gap-5 rounded-[28px] border border-slate-200/80 bg-white/85 p-6 shadow-sm">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

function buildPrintDocument(coverLetter: string, documentTitle: string) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(documentTitle)}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }

          html, body {
            margin: 0;
            padding: 0;
            background: #ffffff;
          }

          body {
            color: #0f172a;
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.6;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          main {
            white-space: pre-wrap;
            word-break: break-word;
          }
        </style>
      </head>
      <body>
        <main>${escapeHtml(coverLetter)}</main>
      </body>
    </html>`;
}

function buildSuggestedPrintTitle(pageTitle: string) {
  return pageTitle.trim() ? `${pageTitle.trim()} Cover Letter` : "Cover Letter";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
