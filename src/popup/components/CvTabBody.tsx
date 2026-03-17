import { useCallback, useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";

import kollektifRegularUrl from "@/fonts/Kollektif.ttf";
import kollektifBoldUrl from "@/fonts/Kollektif-Bold.ttf";
import kollektifItalicUrl from "@/fonts/Kollektif-Italic.ttf";
import kollektifBoldItalicUrl from "@/fonts/Kollektif-BoldItalic.ttf";

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

const A4_PAGE_WIDTH_PX = 794;

const cvTemplateStyles = `
  @font-face {
    font-family: "Kollektif";
    src: url("${kollektifRegularUrl}") format("truetype");
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: "Kollektif";
    src: url("${kollektifBoldUrl}") format("truetype");
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: "Kollektif";
    src: url("${kollektifItalicUrl}") format("truetype");
    font-weight: 400;
    font-style: italic;
  }

  @font-face {
    font-family: "Kollektif";
    src: url("${kollektifBoldItalicUrl}") format("truetype");
    font-weight: 700;
    font-style: italic;
  }

  @page {
    size: A4;
    margin: 0;
  }

  :root {
    --font-size-name: 24px;
    --font-size-role: 14px;
    --font-size-section-title: 16px;
    --font-size-body: 14px;
  }

  .cv-document,
  .cv-document * {
    box-sizing: border-box;
  }

  .cv-document {
    margin: 0;
    padding: 0;
    overflow: visible;
    border: 0;
    border-radius: 0;
    background: transparent;
    font-family: "Kollektif", Arial, Helvetica, sans-serif;
    color: #111;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cv-document--preview {
    width: 210mm;
    margin: 0 auto;
    zoom: var(--cv-preview-zoom, 1);
  }

  .cv-document__page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    background: #fff;
    padding: 10mm 18mm;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
  }

  .cv-document__name {
    margin: 0;
    text-align: center;
    font-size: var(--font-size-name);
    font-weight: 800;
    letter-spacing: 0.4px;
  }

  .cv-document__role {
    margin: 2px 0 4px;
    text-align: center;
    font-size: var(--font-size-role);
    font-weight: 800;
    letter-spacing: 3px;
  }

  .cv-document__contact-line {
    text-align: center;
    font-size: var(--font-size-body);
    line-height: 1.35;
  }

  .cv-document__contact-line a {
    color: #0d4fb3;
    text-decoration: underline;
  }

  .cv-document__divider {
    border: 0;
    border-top: 1px solid #bdbdbd;
    margin: 6px 0 8px;
  }

  .cv-document__profile {
    margin: 0 0 8px 0;
    font-size: var(--font-size-body);
    line-height: 1.35;
  }

  .cv-document__profile strong,
  .cv-document__skill-line strong {
    font-weight: 800;
  }

  .cv-document__section-title {
    margin: 6px 0;
    display: flex;
    align-items: center;
    min-height: 34px;
    padding: 0 10px;
    background: #e9e9e9;
    color: #0d4fb3;
    font-size: var(--font-size-section-title);
    font-weight: 800;
    letter-spacing: 0.4px;
    line-height: 1;
    text-transform: uppercase;
  }

  .cv-document__skill-line {
    margin: 0 0 4px;
    font-size: var(--font-size-body);
    line-height: 1.35;
  }

  .cv-document__entry {
    margin-bottom: 8px;
  }

  .cv-document__header {
    margin: 0;
    font-size: var(--font-size-body);
    line-height: 1.4;
  }

  .cv-document__date {
    color: #0d4fb3;
    font-weight: 800;
  }

  .cv-document__title {
    font-weight: 800;
  }

  .cv-document__stack,
  .cv-document__org-line {
    margin: 1px 0 4px;
    font-size: var(--font-size-body);
    line-height: 1.3;
  }

  .cv-document__org-line em {
    font-style: italic;
    text-decoration: underline;
  }

  .cv-document__list {
    margin: 4px 0 0;
    padding: 0;
    list-style: none;
  }

  .cv-document__list li {
    display: grid;
    grid-template-columns: 10px 1fr;
    // column-gap: 8px;
    align-items: start;
    margin-bottom: 3px;
    font-size: var(--font-size-body);
    line-height: 1.35;
  }

  .cv-document__bullet {
    color: #111;
    font-size: 16px;
    line-height: 1.1;
    transform: translateY(1px);
  }

  .cv-document__bullet-text {
    min-width: 0;
  }

  @media (max-width: 720px) {
    .cv-document__role {
      letter-spacing: 2px;
    }
  }

  @media print {
    .cv-document {
      overflow: visible;
      border: 0;
      border-radius: 0;
    }

    .cv-document--preview {
      width: auto;
      margin: 0;
      zoom: 1;
    }

    .cv-document__page {
      width: 210mm;
      min-height: 297mm;
      padding: 10mm 18mm;
      box-shadow: none;
    }
  }
`;

function buildPrintDocument(templateMarkup: string) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CV Template</title>
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

export function CvTabBody() {
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
      const printHtml = buildPrintDocument(cvTemplateRef.current.outerHTML);
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
  }, [isDownloading]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div ref={previewViewportRef} style={previewViewportStyle}>
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
            <h1 className="cv-document__name">BHUWAN ADHIKARI</h1>
            <div className="cv-document__role">SOFTWARE DEVELOPER</div>
            <div className="cv-document__contact-line">
              Trier, Germany | +4917676330765 |{" "}
              <a href="mailto:bhuwanadhikari7788@gmail.com">
                bhuwanadhikari7788@gmail.com
              </a>
            </div>
            <div className="cv-document__contact-line">
              Github:{" "}
              <a href="https://github.com/bhuwanadhikari">
                github.com/bhuwanadhikari
              </a>{" "}
              | Linkedin:{" "}
              <a href="https://linkedin.com/in/bhuwanadhikari">
                linkedin.com/in/bhuwanadhikari
              </a>
            </div>
            <hr className="cv-document__divider" />

            <p className="cv-document__profile">
              <strong>Profile:</strong> Full stack developer with 4 years&apos;
              experience in full stack development; now pursuing MSc. in NLP to
              specialize in AI and Linguistics, while continuously learning and
              evolving for the future.
            </p>

            <div className="cv-document__section-title">Skills</div>
            <p className="cv-document__skill-line">
              <strong>Frontend:</strong> React.js, Next.js, Redux, Jest, React
              Testing Library, Vite, React Native, Expo
            </p>
            <p className="cv-document__skill-line">
              <strong>Backend:</strong> Node.js, Typescript, Express.js,
              PostgreSQL, MongoDB, REST API, Docker
            </p>

            <div className="cv-document__section-title">
              Professional Experience
            </div>

            <div className="cv-document__entry">
              <p className="cv-document__header">
                <span className="cv-document__date">Mar 2022 - Feb 2025</span> |{" "}
                <span className="cv-document__title">Software Developer</span>
              </p>
              <p className="cv-document__stack">
                [React.js, Node.js, Express.js, Typescript, PostgreSQL, React
                Native, Agile, SCRUM]
              </p>
              <p className="cv-document__org-line">
                <em>Lasting Dynamics</em> | Las Palmas, Spain (Remote)
              </p>
              <ul className="cv-document__list">
                <li>
                  <span className="cv-document__bullet" aria-hidden="true">
                    •
                  </span>
                  <span className="cv-document__bullet-text">
                    Designed and developed enterprise-level web and
                    cross-platform mobile applications using React Native,
                    React.js, Redux, Typescript, and Next.js.
                  </span>
                </li>
                <li>
                  <span className="cv-document__bullet" aria-hidden="true">
                    •
                  </span>
                  <span className="cv-document__bullet-text">
                    Implemented room-based real-time communication using
                    Socket.io, enabling targeted event broadcasting to specific
                    users and groups.
                  </span>
                </li>
                <li>
                  <span className="cv-document__bullet" aria-hidden="true">
                    •
                  </span>
                  <span className="cv-document__bullet-text">
                    Implemented user authentication and role-based authorization
                    using JWT and OAuth2, securing endpoints for 5K+ registered
                    users.
                  </span>
                </li>
                <li>
                  <span className="cv-document__bullet" aria-hidden="true">
                    •
                  </span>
                  <span className="cv-document__bullet-text">
                    Added API documentation with Swagger and aligned endpoints
                    with frontend needs to reduce integration back-and-forth.
                  </span>
                </li>
                <li>
                  <span className="cv-document__bullet" aria-hidden="true">
                    •
                  </span>
                  <span className="cv-document__bullet-text">
                    Built a background PDF generation and email delivery system
                    using Node.js, PostgreSQL, Redis (BullMQ), and AWS SES.
                  </span>
                </li>
                <li>
                  <span className="cv-document__bullet" aria-hidden="true">
                    •
                  </span>
                  <span className="cv-document__bullet-text">
                    Guided and mentored 4 junior developers through code reviews
                    and pair programming, improving code quality and
                    accelerating later sprint bug fixes by 1.5x.
                  </span>
                </li>
              </ul>
            </div>

            <div className="cv-document__entry">
              <p className="cv-document__header">
                <span className="cv-document__date">May 2021 - Feb 2022</span> |{" "}
                <span className="cv-document__title">Software Developer</span>
              </p>
              <p className="cv-document__stack">
                [React.js, Next.js, Node.js, Typescript, Postgresql, Docker,
                Git, Jira]
              </p>
              <p className="cv-document__org-line">
                <em>Khalti</em> | Lalitpur, Nepal
              </p>
              <ul className="cv-document__list">
                <li>
                  <span className="cv-document__bullet" aria-hidden="true">
                    •
                  </span>
                  <span className="cv-document__bullet-text">
                    Designed, developed, and maintained backend RESTful APIs
                    with Express.js/Nest.js and frontend components with
                    React.js and Next.js for a payment gateway used by 1M+
                    users.
                  </span>
                </li>
                <li>
                  <span className="cv-document__bullet" aria-hidden="true">
                    •
                  </span>
                  <span className="cv-document__bullet-text">
                    Implemented modular components with efficient performance
                    using memoization, lazy loading, and code splitting.
                  </span>
                </li>
                <li>
                  <span className="cv-document__bullet" aria-hidden="true">
                    •
                  </span>
                  <span className="cv-document__bullet-text">
                    Developed automated data migration scripts, successfully
                    transferring 500K+ records from a legacy system with zero
                    data loss.
                  </span>
                </li>
              </ul>
            </div>

            <div className="cv-document__section-title">Education</div>

            <div className="cv-document__entry">
              <p className="cv-document__header">
                <span className="cv-document__date">Oct 2025 - Present</span> |{" "}
                <span className="cv-document__title">
                  MSc. in Natural Language Processing
                </span>
              </p>
              <p className="cv-document__org-line">
                <em>Universitat Trier</em> | Trier, Germany
              </p>
              <ul className="cv-document__list">
                <li>
                  <span className="cv-document__bullet" aria-hidden="true">
                    •
                  </span>
                  <span className="cv-document__bullet-text">
                    Researching and learning code-generation principles in NLP
                    at the intersection of AI and software engineering, while
                    building projects with Hugging Face Transformers, spaCy,
                    Pytorch, and NLTK.
                  </span>
                </li>
              </ul>
            </div>

            <div className="cv-document__entry">
              <p className="cv-document__header">
                <span className="cv-document__date">Nov 2016 - May 2021</span> |{" "}
                <span className="cv-document__title">
                  Bachelors Degree in Computer Engineering
                </span>
              </p>
              <p className="cv-document__org-line">
                <em>Tribhuvan University</em> | Kathmandu, Nepal
              </p>
              <ul className="cv-document__list">
                <li>
                  <span className="cv-document__bullet" aria-hidden="true">
                    •
                  </span>
                  <span className="cv-document__bullet-text">
                    Participated in hackathons building projects in robotics,
                    AI, and microcontroller programming.
                  </span>
                </li>
                <li>
                  <span className="cv-document__bullet" aria-hidden="true">
                    •
                  </span>
                  <span className="cv-document__bullet-text">
                    Built a blockchain-based medicine supply chain system using
                    a private blockchain network as a final year project,
                    demonstrating distributed systems and applied cryptography.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </div>

      <div style={toolbarStyle}>
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
      </div>
    </div>
  );
}
