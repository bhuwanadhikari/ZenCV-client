import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { API_BASE_URL, getGeneratedCv } from "@/lib/api";
import type { GenerationStatus } from "@/popup/components/GenerationStatusBar";
import { usePopupStore } from "@/store/use-popup-store";
import { A4_PAGE_WIDTH_PX } from "@/constants/constants";
import { cvTemplateStyles } from "../styles/cvStyles";

export function useCv() {
  const jobDescription = usePopupStore((state) => state.jobDescription);
  const jobDescriptionStatus = usePopupStore(
    (state) => state.jobDescriptionStatus,
  );
  const jobDescriptionError = usePopupStore((state) => state.jobDescriptionError);
  const jobPageTitle = usePopupStore((state) => state.jobPageTitle);
  const jobPageUrl = usePopupStore((state) => state.jobPageUrl);
  const canGenerateCv =
    jobDescriptionStatus === "ready" && jobDescription.trim().length > 0;
  const pageTitleFirstWord = getTitleSnippet(jobPageTitle);
  const cvTemplateRef = useRef<HTMLElement | null>(null);
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [previewZoom, setPreviewZoom] = useState(1);
  const {
    data: generatedCvResponse,
    error: generatedCvError,
    isPending: isGeneratedCvPending,
    isFetching: isGeneratedCvFetching,
    refetch: refetchGeneratedCv,
  } = useQuery({
    queryKey: ["generated-cv", jobDescription, jobPageTitle, jobPageUrl],
    queryFn: () =>
      getGeneratedCv({
        jobDescription,
        job_url: jobPageUrl,
        page_title: jobPageTitle,
        storyJsonOverride: { hi: "hello" },
      }),
    enabled: canGenerateCv,
  });
  const generatedCv = generatedCvResponse?.cv;
  const isGeneratedCvLoading =
    canGenerateCv && (isGeneratedCvPending || isGeneratedCvFetching);
  const generationStatus: GenerationStatus = generatedCv
    ? "success"
    : isGeneratedCvLoading
      ? "loading"
      : jobDescriptionStatus === "error"
        ? "error"
        : canGenerateCv
          ? "error"
          : "waiting";
  const shouldShowPreviewSkeleton = isGeneratedCvLoading;
  const previewErrorMessage = !canGenerateCv
    ? jobDescriptionStatus === "error"
      ? jobDescriptionError || "Unable to process the current page HTML."
      : jobDescriptionStatus === "loading"
        ? "Processing the current page HTML into a job description..."
        : "Process a job description first to generate the CV."
    : !generatedCv
      ? generatedCvError instanceof Error
        ? generatedCvError.message
        : "The generated CV response is unavailable."
      : "";
  const toolbarErrorMessage = !canGenerateCv
    ? jobDescriptionStatus === "loading"
      ? "Wait for the job description to finish processing."
      : "Job description text is required before export."
    : !generatedCv
      ? "Generate the CV from the API to enable PDF export."
      : "";

  useEffect(() => {
    const viewport = previewViewportRef.current;

    if (!viewport) {
      return;
    }

    const updatePreviewZoom = () => {
      const availableWidth = Math.max(viewport.clientWidth - 24, 320);
      setPreviewZoom(Math.min(1, availableWidth / A4_PAGE_WIDTH_PX));
    };

    updatePreviewZoom();

    const observer = new ResizeObserver(() => {
      updatePreviewZoom();
    });

    observer.observe(viewport);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleRetry = useCallback(() => {
    void refetchGeneratedCv();
  }, [refetchGeneratedCv]);

  const handleDownloadPdf = useCallback(async () => {
    if (!cvTemplateRef.current || isDownloading || !generatedCv) {
      return;
    }

    setIsDownloading(true);
    setDownloadError("");

    try {
      const printHtml = buildPrintDocument(
        cvTemplateRef.current.outerHTML,
        buildSuggestedPdfTitle(pageTitleFirstWord, generatedCv.name),
      );
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        throw new Error("The print window was blocked by the browser.");
      }

      printWindow.document.open();
      printWindow.document.write(printHtml);
      printWindow.document.close();

      const images = Array.from(printWindow.document.images);
      await Promise.all(
        images.map(
          (image) =>
            new Promise<void>((resolve) => {
              if (image.complete) {
                resolve();
                return;
              }

              image.addEventListener("load", () => resolve(), {
                once: true,
              });
              image.addEventListener("error", () => resolve(), {
                once: true,
              });
            }),
        ),
      );

      if ("fonts" in printWindow.document) {
        await printWindow.document.fonts.ready;
      }

      try {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      } catch (printError) {
        console.error(printError);
      }
    } catch (error) {
      console.error(error);
      setDownloadError("Unable to open the print dialog for Save as PDF.");
    } finally {
      setIsDownloading(false);
    }
  }, [generatedCv, isDownloading, pageTitleFirstWord]);

  return {
    cvTemplateRef,
    downloadError,
    endpoint: `${API_BASE_URL}/api/cv/generate`,
    generatedCv,
    generationStatus,
    handleDownloadPdf,
    handleRetry,
    isDownloading,
    isRetryDisabled: !canGenerateCv || isGeneratedCvFetching,
    isRetrying: isGeneratedCvFetching,
    previewErrorMessage,
    previewViewportRef,
    previewZoom,
    shouldShowPreviewSkeleton,
    toolbarErrorMessage,
  };
}

function buildPrintDocument(templateMarkup: string, documentTitle: string) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(documentTitle)}</title>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            background: #ffffff;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          ${cvTemplateStyles}
        </style>
      </head>
      <body>
        ${templateMarkup}
      </body>
    </html>`;
}

function buildSuggestedPdfTitle(pageTitleFirstWord: string, cvOwnerName: string) {
  const ownerName = cvOwnerName.trim() || "Candidate";

  return pageTitleFirstWord
    ? `${ownerName} CV ${pageTitleFirstWord}`
    : `${ownerName} CV`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getTitleSnippet(title: string) {
  return title.trim().match(/\S+(?:\s+\S+)?/)?.[0] ?? "";
}
