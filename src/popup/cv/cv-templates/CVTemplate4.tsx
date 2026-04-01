import { forwardRef } from "react";
import latoRegularUrl from "@/fonts/lato/Lato-Regular.ttf";
import latoBoldUrl from "@/fonts/lato/Lato-Bold.ttf";
import latoItalicUrl from "@/fonts/lato/Lato-Italic.ttf";
import latoBoldItalicUrl from "@/fonts/lato/Lato-BoldItalic.ttf";

import type { CvContactItem, CvData, CvEntry } from "@/constants/cvData";

type CVTemplate4Props = {
  cv: CvData;
  previewZoom: number;
};

export const CVTemplate4 = forwardRef<HTMLElement, CVTemplate4Props>(
  function CVTemplate4({ cv, previewZoom }, ref) {
    return (
      <article
        ref={ref}
        className="cv-document cv-document--preview cv-template-four"
        style={getPreviewDocumentStyle(previewZoom)}
      >
        <style>{styles}</style>

        <div className="cv-template-four__page">
          <header className="cv-template-four__header">
            <div>
              <p className="cv-template-four__eyebrow">Curriculum Vitae</p>
              <h1 className="cv-template-four__name">{cv.name}</h1>
              <p className="cv-template-four__role">{cv.role}</p>
            </div>

            <div className="cv-template-four__header-contact">
              {cv.contactLines.map((line, lineIndex) => (
                <ContactLine
                  key={`template-four-contact-${lineIndex}`}
                  line={line}
                  className="cv-template-four__contact-line"
                  linkClassName="cv-template-four__contact-link"
                  separator=" • "
                />
              ))}
            </div>
          </header>

          <div className="cv-template-four__body">
            <aside className="cv-template-four__sidebar">
              <section className="cv-template-four__panel">
                <p className="cv-template-four__panel-title">{cv.profile.label}</p>
                <p className="cv-template-four__summary">{cv.profile.summary}</p>
              </section>

              <section className="cv-template-four__panel">
                <p className="cv-template-four__panel-title">Core Skills</p>
                <div className="cv-template-four__skills">
                  {cv.skillGroups.map((skillGroup) => (
                    <div
                      key={skillGroup.label}
                      className="cv-template-four__skill-group"
                    >
                      <h3 className="cv-template-four__skill-label">
                        {skillGroup.label}
                      </h3>
                      <p className="cv-template-four__skill-items">
                        {skillGroup.items.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </aside>

            <main className="cv-template-four__main">
              {cv.sections.map((section) => (
                <section key={section.title} className="cv-template-four__section">
                  <div className="cv-template-four__section-header">
                    <h2 className="cv-template-four__section-title">
                      {section.title}
                    </h2>
                  </div>

                  <div className="cv-template-four__entries">
                    {section.entries.map((entry) => (
                      <article
                        key={`${entry.title}-${entry.dateRange}`}
                        className="cv-template-four__entry"
                      >
                        <div className="cv-template-four__entry-head">
                          <div>
                            <p className="cv-template-four__entry-title">
                              {entry.title}
                            </p>
                            <p className="cv-template-four__entry-org">
                              {entry.organization.url ? (
                                <a
                                  href={entry.organization.url}
                                  className="cv-template-four__org-link"
                                >
                                  {entry.organization.name}
                                </a>
                              ) : (
                                entry.organization.name
                              )}
                              {entry.organization.address
                                ? ` · ${entry.organization.address}`
                                : null}
                            </p>
                          </div>

                          <div className="cv-template-four__entry-side">
                            <p className="cv-template-four__entry-date">
                              {entry.dateRange}
                            </p>
                            <ResourceLink
                              resource={entry.resource}
                              className="cv-template-four__resource"
                              linkClassName="cv-template-four__resource-link"
                            />
                          </div>
                        </div>

                        {entry.stack?.length ? (
                          <p className="cv-template-four__stack">
                            {entry.stack.join(" · ")}
                          </p>
                        ) : null}

                        <BulletList
                          bullets={entry.bullets}
                          className="cv-template-four__bullet-list"
                          itemClassName="cv-template-four__bullet-item"
                          bulletClassName="cv-template-four__bullet-symbol"
                          textClassName="cv-template-four__bullet-text"
                          symbol="—"
                        />
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </main>
          </div>
        </div>
      </article>
    );
  },
);

function getPreviewDocumentStyle(previewZoom: number): React.CSSProperties {
  return {
    "--cv-preview-zoom": String(previewZoom),
  } as React.CSSProperties;
}

function ContactLine({
  line,
  className,
  linkClassName,
  separator = " | ",
}: {
  line: CvContactItem[];
  className?: string;
  linkClassName?: string;
  separator?: React.ReactNode;
}) {
  return (
    <div className={className}>
      {line.map((item, itemIndex) => (
        <span key={`${item.label ?? item.value}-${itemIndex}`}>
          {itemIndex > 0 ? separator : null}
          {item.label ? `${item.label}: ` : null}
          {item.href ? (
            <a href={item.href} className={linkClassName}>
              {item.value}
            </a>
          ) : (
            item.value
          )}
        </span>
      ))}
    </div>
  );
}

function ResourceLink({
  resource,
  className,
  linkClassName,
}: {
  resource?: CvEntry["resource"];
  className?: string;
  linkClassName?: string;
}) {
  if (!resource) {
    return null;
  }

  return (
    <span className={className}>
      {resource.url ? (
        <a href={resource.url} className={linkClassName}>
          {resource.placeholder}
        </a>
      ) : (
        resource.placeholder
      )}
      <LinkResourceIcon />
    </span>
  );
}

function BulletList({
  bullets,
  className,
  itemClassName,
  bulletClassName,
  textClassName,
  symbol = "•",
}: {
  bullets: string[];
  className?: string;
  itemClassName?: string;
  bulletClassName?: string;
  textClassName?: string;
  symbol?: React.ReactNode;
}) {
  return (
    <ul className={className}>
      {bullets.map((bullet, bulletIndex) => (
        <li key={`${bullet}-${bulletIndex}`} className={itemClassName}>
          <span className={bulletClassName} aria-hidden="true">
            {symbol}
          </span>
          <span className={textClassName}>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

function LinkResourceIcon() {
  return (
    <svg
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
    margin: 15mm 0;
  }

  .cv-document,
  .cv-document * {
    box-sizing: border-box;
  }

  .cv-document {
    margin: 0;
    padding: 0;
    background: transparent;
    color: #111827;
    font-family: "Lato", Arial, Helvetica, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cv-document--preview {
    width: 210mm;
    margin: 0 auto;
    zoom: var(--cv-preview-zoom, 1);
  }

  .cv-template-four__page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 13mm 15mm 12mm;
    background: #ffffff;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
  }

  .cv-template-four__header {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    padding-bottom: 11px;
    border-bottom: 1px solid #d1d5db;
  }

  .cv-template-four__eyebrow {
    margin: 0 0 8px;
    color: #6b7280;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.28em;
    text-transform: uppercase;
  }

  .cv-template-four__name {
    margin: 0;
    font-size: 30px;
    font-weight: 800;
  }

  .cv-template-four__role {
    margin: 4px 0 0;
    font-size: 14px;
    color: #1f2937;
  }

  .cv-template-four__header-contact {
    max-width: 76mm;
    align-self: flex-end;
  }

  .cv-template-four__contact-line {
    text-align: right;
    font-size: 12px;
    line-height: 1.45;
    color: #4b5563;
  }

  .cv-template-four__contact-link,
  .cv-template-four__org-link,
  .cv-template-four__resource-link {
    color: inherit;
    text-decoration: none;
  }

  .cv-template-four__body {
    display: grid;
    grid-template-columns: 54mm minmax(0, 1fr);
    gap: 16px;
    margin-top: 12px;
  }

  .cv-template-four__sidebar {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .cv-template-four__panel {
    border-top: 2px solid #111827;
    padding-top: 10px;
  }

  .cv-template-four__panel-title {
    margin: 0 0 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #6b7280;
  }

  .cv-template-four__summary,
  .cv-template-four__skill-items {
    margin: 0;
    color: #1f2937;
    font-size: 12px;
    line-height: 1.58;
  }

  .cv-template-four__skills {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cv-template-four__skill-label {
    margin: 0 0 4px;
    font-size: 12px;
    font-weight: 800;
    color: #111827;
  }

  .cv-template-four__main {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .cv-template-four__section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .cv-template-four__section-header::after {
    content: "";
    flex: 1 1 auto;
    height: 1px;
    background: #d1d5db;
  }

  .cv-template-four__section-title {
    margin: 0;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .cv-template-four__entries {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .cv-template-four__entry {
    padding-bottom: 9px;
    border-bottom: 1px solid #e5e7eb;
  }

  .cv-template-four__entry:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .cv-template-four__entry-head {
    display: flex;
    justify-content: space-between;
    gap: 14px;
  }

  .cv-template-four__entry-title,
  .cv-template-four__entry-org,
  .cv-template-four__entry-date,
  .cv-template-four__stack {
    margin: 0;
  }

  .cv-template-four__entry-title {
    font-size: 15px;
    font-weight: 800;
  }

  .cv-template-four__entry-org {
    margin-top: 4px;
    color: #4b5563;
    font-size: 12px;
    line-height: 1.45;
  }

  .cv-template-four__entry-side {
    min-width: 29mm;
    text-align: right;
  }

  .cv-template-four__entry-date {
    color: #111827;
    font-size: 12px;
    font-weight: 700;
  }

  .cv-template-four__resource {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 6px;
    color: #6b7280;
    font-size: 12px;
  }

  .cv-template-four__stack {
    margin-top: 6px;
    color: #6b7280;
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .cv-template-four__bullet-list {
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
  }

  .cv-template-four__bullet-item {
    display: grid;
    grid-template-columns: 14px 1fr;
    gap: 6px;
    margin-bottom: 4px;
    font-size: 12px;
    line-height: 1.5;
  }

  .cv-template-four__bullet-symbol {
    color: #4b5563;
  }

  .cv-template-four__bullet-text {
    min-width: 0;
  }

  @media print {
    .cv-document--preview {
      width: auto;
      margin: 0;
      zoom: 1;
    }

    .cv-template-four__page {
      box-shadow: none;
    }
  }
`;
