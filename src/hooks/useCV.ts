import { useCallback, useEffect, useRef, useState } from "react";
import { A4_PAGE_WIDTH_PX } from "../constants/constants";
import { cvTemplateStyles } from "../constants/cvStyles";

export const useCV = (pageTitleFirstWord = "", cvOwnerName = "") => {
  const cvTemplateRef = useRef<HTMLElement | null>(null);
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [previewZoom, setPreviewZoom] = useState(1);

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

  const handleDownloadPdf = useCallback(async () => {
    if (!cvTemplateRef.current || isDownloading) {
      return;
    }

    setIsDownloading(true);
    setDownloadError("");

    try {
      const printHtml = buildPrintDocument(
        cvTemplateRef.current.outerHTML,
        buildSuggestedPdfTitle(pageTitleFirstWord, cvOwnerName),
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
  }, [cvOwnerName, isDownloading, pageTitleFirstWord]);

  return {
    previewViewportRef,
    cvTemplateRef,
    previewZoom,
    downloadError,
    handleDownloadPdf,
    isDownloading,
  };
};

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
