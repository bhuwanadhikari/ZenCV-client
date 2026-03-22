import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Mail } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL, getGeneratedCoverLetter } from "@/lib/api";
import {
  GenerationStatusBar,
  type GenerationStatus,
} from "@/popup/components/GenerationStatusBar";
import { usePopupStore } from "@/store/use-popup-store";
const errorStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "12px",
  color: "#be123c",
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

const coverLetterParagraphStyle: React.CSSProperties = {
  margin: 0,
  whiteSpace: "pre-wrap",
  textAlign: "justify",
  textJustify: "inter-word",
};

const iconActionButtonClassName =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-800 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50";

export function CoverLetterTabBody() {
  const jobDescription = usePopupStore((state) => state.jobDescription);
  const jobDescriptionStatus = usePopupStore(
    (state) => state.jobDescriptionStatus,
  );
  const jobDescriptionError = usePopupStore((state) => state.jobDescriptionError);
  const jobPageTitle = usePopupStore((state) => state.jobPageTitle);
  const jobPageUrl = usePopupStore((state) => state.jobPageUrl);
  const canGenerateCoverLetter =
    jobDescriptionStatus === "ready" && jobDescription.trim().length > 0;
  const {
    data: generatedCoverLetterResponse,
    error: generatedCoverLetterError,
    isPending: isGeneratedCoverLetterPending,
    isFetching: isGeneratedCoverLetterFetching,
    refetch: refetchGeneratedCoverLetter,
  } = useQuery({
    queryKey: ["generated-cover-letter", jobDescription, jobPageTitle, jobPageUrl],
    queryFn: () =>
      getGeneratedCoverLetter({
        jobDescription,
        job_url: jobPageUrl,
        page_title: jobPageTitle,
      }),
    enabled: canGenerateCoverLetter,
  });
  const generatedCoverLetter = generatedCoverLetterResponse?.coverLetter;
  const [isPrinting, setIsPrinting] = useState(false);
  const [isComposingEmail, setIsComposingEmail] = useState(false);
  const [printError, setPrintError] = useState("");
  const [composeEmailError, setComposeEmailError] = useState("");
  const isGeneratedCoverLetterLoading =
    canGenerateCoverLetter &&
    (isGeneratedCoverLetterPending || isGeneratedCoverLetterFetching);
  const generationStatus: GenerationStatus = generatedCoverLetter
    ? "success"
    : isGeneratedCoverLetterLoading
      ? "loading"
      : jobDescriptionStatus === "error"
        ? "error"
        : canGenerateCoverLetter
          ? "error"
          : "waiting";
  const shouldShowPreviewSkeleton = isGeneratedCoverLetterLoading;

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
        buildPrintDocument(
          generatedCoverLetter,
          buildSuggestedPrintTitle(jobPageTitle),
        ),
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
  }, [generatedCoverLetter, isPrinting, jobPageTitle]);

  const handleComposeEmail = useCallback(() => {
    if (!generatedCoverLetter || isComposingEmail) {
      return;
    }

    setIsComposingEmail(true);
    setComposeEmailError("");

    try {
      const composeWindow = window.open(
        buildComposeEmailUrl(generatedCoverLetter, jobPageTitle),
        "_blank",
        "noopener,noreferrer",
      );

      if (!composeWindow) {
        throw new Error("The email window was blocked by the browser.");
      }
    } catch (error) {
      console.error(error);
      setComposeEmailError("Unable to open Gmail compose.");
    } finally {
      setIsComposingEmail(false);
    }
  }, [generatedCoverLetter, isComposingEmail, jobPageTitle]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <GenerationStatusBar
        endpoint={`${API_BASE_URL}/api/cover-letter/generate`}
        status={generationStatus}
        onRetry={() => {
          void refetchGeneratedCoverLetter();
        }}
        retryLabel="Retry cover letter generation"
        extraAction={
          generatedCoverLetter ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleComposeEmail}
                disabled={isComposingEmail}
                aria-label={isComposingEmail ? "Opening Gmail" : "Compose Email"}
                title={isComposingEmail ? "Opening Gmail" : "Compose Email"}
                className={iconActionButtonClassName}
              >
                <Mail size={14} />
                <span className="sr-only">
                  {isComposingEmail ? "Opening Gmail" : "Compose Email"}
                </span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                disabled={isPrinting}
                aria-label={isPrinting ? "Opening Print" : "Save as PDF"}
                title={isPrinting ? "Opening Print" : "Save as PDF"}
                className={iconActionButtonClassName}
              >
                <Download size={14} />
                <span className="sr-only">
                  {isPrinting ? "Opening Print" : "Save as PDF"}
                </span>
              </button>
            </div>
          ) : null
        }
        retryDisabled={
          !canGenerateCoverLetter || isGeneratedCoverLetterFetching
        }
        isRetrying={isGeneratedCoverLetterFetching}
      />
      {composeEmailError ? <p style={errorStyle}>{composeEmailError}</p> : null}
      {printError ? <p style={errorStyle}>{printError}</p> : null}

      <div style={previewViewportStyle}>
        {shouldShowPreviewSkeleton ? (
          <CoverLetterPreviewSkeleton />
        ) : !canGenerateCoverLetter ? (
          <p style={contentErrorStyle}>
            {jobDescriptionStatus === "error"
              ? jobDescriptionError || "Unable to process the current page HTML."
              : jobDescriptionStatus === "loading"
                ? "Processing the current page HTML into a job description..."
                : "Process a job description first to generate the cover letter."}
          </p>
        ) : !generatedCoverLetter ? (
          <p style={contentErrorStyle}>
            {generatedCoverLetterError instanceof Error
              ? generatedCoverLetterError.message
              : "The generated cover letter response is unavailable."}
          </p>
        ) : (
          <article className="rounded-[28px] border border-slate-200/80 bg-white/85 p-6 shadow-sm">
            <p
              className="text-sm leading-7 text-slate-700"
              style={coverLetterParagraphStyle}
            >
              {generatedCoverLetter}
            </p>
          </article>
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
            text-align: justify;
            text-justify: inter-word;
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

function buildComposeEmailUrl(coverLetter: string, pageTitle: string) {
  const composeUrl = new URL("https://mail.google.com/mail/");

  composeUrl.searchParams.set("view", "cm");
  composeUrl.searchParams.set("fs", "1");
  composeUrl.searchParams.set("su", buildSuggestedEmailSubject(pageTitle));
  composeUrl.searchParams.set("body", coverLetter);

  return composeUrl.toString();
}

function buildSuggestedEmailSubject(pageTitle: string) {
  return pageTitle.trim()
    ? `Application for ${pageTitle.trim()}`
    : "Application";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
