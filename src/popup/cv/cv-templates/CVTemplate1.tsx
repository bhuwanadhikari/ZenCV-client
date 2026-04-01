import { forwardRef } from "react";
import kollektifRegularUrl from "@/fonts/Kollektif.ttf";
import kollektifBoldUrl from "@/fonts/Kollektif-Bold.ttf";
import kollektifItalicUrl from "@/fonts/Kollektif-Italic.ttf";
import kollektifBoldItalicUrl from "@/fonts/Kollektif-BoldItalic.ttf";

import type { CvData } from "@/constants/cvData";

type CVTemplate1Props = {
  cv: CvData;
  previewZoom: number;
};

// Self-contained CV template used for both the popup preview and print/export markup.
export const CVTemplate1 = forwardRef<HTMLElement, CVTemplate1Props>(
  function CVTemplate1({ cv, previewZoom }, ref) {
    return (
      <article
        ref={ref}
        className="cv-document cv-document--preview"
        style={
          {
            "--cv-preview-zoom": String(previewZoom),
          } as React.CSSProperties
        }
      >
        <style>{styles}</style>

        <div className="cv-document__page">
          <h1 className="cv-document__name">{cv.name}</h1>
          <div className="cv-document__role">{cv.role}</div>
          {cv.contactLines.map((line, lineIndex) => (
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
            <strong>{cv.profile.label}:</strong> {cv.profile.summary}
          </p>

          <div className="cv-document__section-title">Skills</div>
          {cv.skillGroups.map((skillGroup) => (
            <p key={skillGroup.label} className="cv-document__skill-line">
              <strong>{skillGroup.label}:</strong> {skillGroup.items.join(", ")}
            </p>
          ))}

          {cv.sections.map((section) => (
            <div key={section.title}>
              <div className="cv-document__section-title">{section.title}</div>

              {section.entries.map((entry) => {
                const hasDateRange = Boolean(entry.dateRange);
                const hasTitle = Boolean(entry.title);
                const hasOrganizationName = Boolean(entry.organization.name);
                const hasOrganizationAddress = Boolean(
                  entry.organization.address,
                );

                return (
                  <div
                    key={`${entry.title}-${entry.dateRange}`}
                    className="cv-document__entry"
                  >
                    <p className="cv-document__header">
                      <span className="cv-document__header-main">
                        {hasDateRange ? (
                          <span className="cv-document__date">
                            {entry.dateRange}
                          </span>
                        ) : null}
                        {hasDateRange && hasTitle ? " | " : null}
                        {hasTitle ? (
                          <span className="cv-document__title">
                            {entry.title}
                          </span>
                        ) : null}
                      </span>
                      {entry.resource ? (
                        <span className="cv-document__resource">
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
                    </p>
                    {entry.stack && entry.stack.length > 0 ? (
                      <p className="cv-document__stack">
                        [{entry.stack.join(", ")}]
                      </p>
                    ) : null}
                    <p className="cv-document__org-line">
                      <span className="cv-document__org-main">
                        {hasOrganizationName ? (
                          entry.organization.url ? (
                            <a href={entry.organization.url}>
                              <em>{entry.organization.name}</em>
                            </a>
                          ) : (
                            <em>{entry.organization.name}</em>
                          )
                        ) : null}
                        {hasOrganizationName && hasOrganizationAddress
                          ? " | "
                          : null}
                        {hasOrganizationAddress
                          ? entry.organization.address
                          : null}
                      </span>
                    </p>
                    <ul className="cv-document__list">
                      {entry.bullets.map((bullet, bulletIndex) => (
                        <li key={`${entry.title}-bullet-${bulletIndex}`}>
                          <span
                            className="cv-document__bullet"
                            aria-hidden="true"
                          >
                            •
                          </span>
                          <span className="cv-document__bullet-text">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
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
      className="cv-document__resource-icon"
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

export const styles = `
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
    margin: 15mm 0 15mm 0;
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
    letter-spacing: 2px;
    text-transform: uppercase;
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
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    font-size: var(--font-size-body);
    line-height: 1.4;
  }

  .cv-document__header-main {
    min-width: 0;
    flex: 1 1 auto;
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

  .cv-document__org-main {
    min-width: 0;
  }

  .cv-document__org-line em {
    font-style: italic;
    text-decoration: underline;
  }

  .cv-document__org-line a {
    color: inherit;
    text-decoration: none;
  }

  .cv-document__resource {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    margin-left: auto;
    white-space: nowrap;
    color: #0d4fb3;
  }

  .cv-document__resource a {
    color: inherit;
    text-decoration: underline;
  }

  .cv-document__resource-icon {
    flex-shrink: 0;
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
      min-height: 285mm;
      padding: 0 18mm;
      box-shadow: none;
    }
  }
`;
