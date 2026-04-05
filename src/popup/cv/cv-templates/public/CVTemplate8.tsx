import { forwardRef } from "react";
import latoRegularUrl from "@/fonts/lato/Lato-Regular.ttf";
import latoBoldUrl from "@/fonts/lato/Lato-Bold.ttf";
import latoItalicUrl from "@/fonts/lato/Lato-Italic.ttf";
import latoBoldItalicUrl from "@/fonts/lato/Lato-BoldItalic.ttf";

import type { CvData } from "@/constants/cvData";

type CVTemplate8Props = {
  cv: CvData;
  previewZoom: number;
};

export const CVTemplate8 = forwardRef<HTMLElement, CVTemplate8Props>(
  function CVTemplate8({ cv, previewZoom }, ref) {
    return (
      <article
        ref={ref}
        className="cv-document cv-document--preview cv-template-eight"
        style={
          {
            "--cv-preview-zoom": String(previewZoom),
          } as React.CSSProperties
        }
      >
        <style>{styles}</style>

        <div className="cv-template-eight__page">
          <header className="cv-template-eight__header">
            <h1 className="cv-template-eight__name">{cv.name}</h1>
            <p className="cv-template-eight__role">{cv.role}</p>
            <div className="cv-template-eight__contact">
              {cv.contactLines.map((line, lineIndex) => (
                <div
                  key={`template-eight-contact-${lineIndex}`}
                  className="cv-template-eight__contact-line"
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
            </div>
          </header>

          {/* Separator before Profile */}
          <hr className="cv-template-eight__separator" />
          <section className="cv-template-eight__section">
            <h2 className="cv-template-eight__section-title">
              {cv.profile.label}
            </h2>
            <p className="cv-template-eight__profile">{cv.profile.summary}</p>
          </section>

          {cv.sections.map((section) => (
            <div key={section.title}>
              {/* Separator before main sections */}
              <hr className="cv-template-eight__separator" />

              <section className="cv-template-eight__section">
                <h2 className="cv-template-eight__section-title">
                  {section.title}
                </h2>

                {section.entries.map((entry) => {
                  const hasDateRange = Boolean(entry.dateRange);
                  const hasTitle = Boolean(entry.title);
                  const hasOrganizationName = Boolean(entry.organization.name);
                  const hasOrganizationAddress = Boolean(
                    entry.organization.address,
                  );

                  return (
                    <article
                      key={`${entry.title}-${entry.dateRange}`}
                      className="cv-template-eight__entry"
                    >
                      <div className="cv-template-eight__header-block">
                        <div className="cv-template-eight__header-copy">
                          {hasTitle ? (
                            <p className="cv-template-eight__entry-title">
                              {entry.title}
                            </p>
                          ) : null}
                        </div>

                        {entry.resource ? (
                          <span className="cv-template-eight__resource">
                            {entry.resource.url ? (
                              <a href={entry.resource.url}>
                                {entry.resource.placeholder}
                              </a>
                            ) : (
                              entry.resource.placeholder
                            )}
                            <LinkResourceIcon />
                          </span>
                        ) : null}
                      </div>

                      {(hasOrganizationName || hasDateRange || hasOrganizationAddress) && (
                        <p className="cv-template-eight__org-line">
                          {hasOrganizationName ? entry.organization.name : null}
                          {hasOrganizationName && (hasDateRange || hasOrganizationAddress)
                            ? " | "
                            : null}
                          {hasDateRange ? entry.dateRange : null}
                          {hasDateRange && hasOrganizationAddress ? " | " : null}
                          {hasOrganizationAddress ? entry.organization.address : null}
                        </p>
                      )}

                      <ul className="cv-template-eight__list">
                        {entry.bullets.map((bullet, bulletIndex) => (
                          <li key={`${entry.title}-bullet-${bulletIndex}`}>
                            <span
                              className="cv-template-eight__bullet"
                              aria-hidden="true"
                            >
                              •
                            </span>
                            <span className="cv-template-eight__bullet-text">
                              {bullet}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </section>
            </div>
          ))}
        </div>
      </article>
    );
  },
);

function LinkResourceIcon() {
  return (
    <svg
      className="cv-template-eight__resource-icon"
      viewBox="0 0 16 16"
      width="13"
      height="13"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6 4.5H4.75A2.25 2.25 0 0 0 2.5 6.75v4.5a2.25 2.25 0 0 0 2.25 2.25h4.5a2.25 2.25 0 0 0 2.25-2.25V10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 3.5h4.5V8M12.25 3.75 7 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const styles = `
  @font-face {
    font-family: "Lato";
    src: url("${latoRegularUrl}") format("truetype");
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: "Lato";
    src: url("${latoBoldUrl}") format("truetype");
    font-weight: 700;
    font-style: normal;
  }
  @font-face {
    font-family: "Lato";
    src: url("${latoItalicUrl}") format("truetype");
    font-weight: 400;
    font-style: italic;
  }
  @font-face {
    font-family: "Lato";
    src: url("${latoBoldItalicUrl}") format("truetype");
    font-weight: 700;
    font-style: italic;
  }

  @page {
    size: A4;
    margin: 15mm 0 15mm 0;
  }

  :root {
    --font-size-name: 25px;
    --font-size-role: 13px;
    --font-size-section-title: 14px;
    --font-size-body: 13px;
    --template-eight-accent: #143d7a;
    --template-eight-text: #111827;
    --template-eight-muted: #5b6472;
  }

  .cv-template-eight,
  .cv-template-eight * {
    box-sizing: border-box;
  }

  .cv-template-eight {
    margin: 0;
    padding: 0;
    overflow: visible;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: var(--template-eight-text);
    font-family: "Lato", Arial, Helvetica, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cv-document--preview.cv-template-eight {
    width: 210mm;
    margin: 0 auto;
    zoom: var(--cv-preview-zoom, 1);
  }

  .cv-template-eight__page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    background: #fff;
    padding: 12mm 18mm;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
  }

  .cv-template-eight__header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    text-align: left;
  }

  .cv-template-eight__name {
    margin: 0;
    font-size: var(--font-size-name);
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .cv-template-eight__role {
    margin: 0;
    color: var(--template-eight-accent);
    font-size: var(--font-size-role);
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .cv-template-eight__contact {
    margin-top: 4px;
  }

  .cv-template-eight__contact-line {
    text-align: left;
    font-size: var(--font-size-body);
    line-height: 1.35;
  }

  .cv-template-eight__contact-line a {
    color: var(--template-eight-accent);
    text-decoration: none;
  }

  .cv-template-eight__section {
    margin-bottom: 12px;
  }

  .cv-template-eight__section-title {
    margin: 10px 0 6px;
    padding: 0;
    color: var(--template-eight-accent);
    font-size: var(--font-size-section-title);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .cv-template-eight__profile {
    margin: 0;
    font-size: var(--font-size-body);
    line-height: 1.45;
  }

  .cv-template-eight__entry {
    margin-bottom: 10px;
  }

  .cv-template-eight__header-block {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .cv-template-eight__header-copy {
    min-width: 0;
    flex: 1 1 auto;
  }

  .cv-template-eight__entry-title {
    margin: 0;
    font-size: var(--font-size-body);
    font-weight: 700;
    line-height: 1.35;
  }

  .cv-template-eight__date {
    margin: 0;
    color: var(--template-eight-accent);
    font-size: var(--font-size-body);
    font-weight: 700;
    line-height: 1.35;
  }

  .cv-template-eight__org-line {
    margin: 2px 0 4px;
    color: var(--template-eight-muted);
    font-size: var(--font-size-body);
    line-height: 1.35;
  }

  .cv-template-eight__org-line em {
    font-style: normal;
  }

  .cv-template-eight__resource {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    margin-left: auto;
    white-space: nowrap;
    color: var(--template-eight-accent);
  }

  .cv-template-eight__resource a {
    color: inherit;
    text-decoration: none;
  }

  .cv-template-eight__resource-icon {
    flex-shrink: 0;
  }

  .cv-template-eight__list {
    margin: 4px 0 0;
    padding: 0;
    list-style: none;
  }

  .cv-template-eight__list li {
    display: grid;
    grid-template-columns: 10px 1fr;
    align-items: start;
    margin-bottom: 3px;
    font-size: var(--font-size-body);
    line-height: 1.4;
  }

  .cv-template-eight__bullet {
    color: var(--template-eight-text);
    font-size: 15px;
    line-height: 1.1;
    transform: translateY(1px);
  }

  .cv-template-eight__bullet-text {
    min-width: 0;
  }

  .cv-template-eight__separator {
    border: none;
    border-top: 1px solid #d1d5db;
    margin: 12px 0;
  }

  @media print {
    .cv-template-eight {
      overflow: visible;
      border: 0;
      border-radius: 0;
    }

    .cv-document--preview.cv-template-eight {
      width: auto;
      margin: 0;
      zoom: 1;
    }

    .cv-template-eight__page {
      width: 210mm;
      min-height: 285mm;
      padding: 0 18mm;
      box-shadow: none;
    }
  }
`;