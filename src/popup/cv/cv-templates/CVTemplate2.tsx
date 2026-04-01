import { forwardRef } from "react";
import latoRegularUrl from "@/fonts/lato/Lato-Regular.ttf";
import latoBoldUrl from "@/fonts/lato/Lato-Bold.ttf";
import latoItalicUrl from "@/fonts/lato/Lato-Italic.ttf";
import latoBoldItalicUrl from "@/fonts/lato/Lato-BoldItalic.ttf";

import type { CvContactItem, CvData, CvEntry } from "@/constants/cvData";

type CVTemplate2Props = {
  cv: CvData;
  previewZoom: number;
};

export const CVTemplate2 = forwardRef<HTMLElement, CVTemplate2Props>(
  function CVTemplate2({ cv, previewZoom }, ref) {
    const totalEntries = cv.sections.reduce(
      (count, section) => count + section.entries.length,
      0,
    );

    return (
      <article
        ref={ref}
        className="cv-document cv-document--preview cv-template-two"
        style={getPreviewDocumentStyle(previewZoom)}
      >
        <style>{styles}</style>

        <div className="cv-template-two__page">
          <header className="cv-template-two__header">
            <div>
              <h1 className="cv-template-two__name">{cv.name}</h1>
              <p className="cv-template-two__role">{cv.role}</p>
            </div>
            <div className="cv-template-two__contact">
              {cv.contactLines.map((line, lineIndex) => (
                <ContactLine
                  key={`template-two-contact-${lineIndex}`}
                  line={line}
                  className="cv-template-two__contact-line"
                  linkClassName="cv-template-two__contact-link"
                  separator=" • "
                />
              ))}
            </div>
          </header>

          <div className="cv-template-two__body">
            <main className="cv-template-two__main">
              <section className="cv-template-two__profile-card">
                <p className="cv-template-two__eyebrow">{cv.profile.label}</p>
                <p className="cv-template-two__profile-copy">
                  {cv.profile.summary}
                </p>
              </section>

              {cv.sections.map((section, sectionIndex) => (
                <section key={section.title} className="cv-template-two__section">
                  <div className="cv-template-two__section-heading">
                    <span className="cv-template-two__section-index">
                      {String(sectionIndex + 1).padStart(2, "0")}
                    </span>
                    <h2 className="cv-template-two__section-title">
                      {section.title}
                    </h2>
                  </div>

                  <div className="cv-template-two__entries">
                    {section.entries.map((entry) => (
                      <article
                        key={`${entry.title}-${entry.dateRange}`}
                        className="cv-template-two__entry"
                      >
                        <div className="cv-template-two__entry-top">
                          <div>
                            <p className="cv-template-two__entry-title">
                              {entry.title}
                            </p>
                            <p className="cv-template-two__entry-date">
                              {entry.dateRange}
                            </p>
                          </div>

                          <ResourceLink
                            resource={entry.resource}
                            className="cv-template-two__resource"
                            linkClassName="cv-template-two__resource-link"
                          />
                        </div>

                        <p className="cv-template-two__organization">
                          {entry.organization.url ? (
                            <a
                              href={entry.organization.url}
                              className="cv-template-two__organization-link"
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

                        {entry.stack?.length ? (
                          <div className="cv-template-two__stack">
                            {entry.stack.map((item) => (
                              <span
                                key={`${entry.title}-${item}`}
                                className="cv-template-two__stack-tag"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        <BulletList
                          bullets={entry.bullets}
                          className="cv-template-two__bullet-list"
                          itemClassName="cv-template-two__bullet-item"
                          bulletClassName="cv-template-two__bullet-symbol"
                          textClassName="cv-template-two__bullet-text"
                        />
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </main>

            <aside className="cv-template-two__sidebar">
              <section className="cv-template-two__panel">
                <p className="cv-template-two__panel-label">Skills</p>
                <div className="cv-template-two__skill-groups">
                  {cv.skillGroups.map((skillGroup) => (
                    <div
                      key={skillGroup.label}
                      className="cv-template-two__skill-group"
                    >
                      <h3 className="cv-template-two__skill-label">
                        {skillGroup.label}
                      </h3>
                      <p className="cv-template-two__skill-items">
                        {skillGroup.items.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="cv-template-two__panel">
                <p className="cv-template-two__panel-label">Snapshot</p>
                <div className="cv-template-two__metrics">
                  <div className="cv-template-two__metric">
                    <span className="cv-template-two__metric-value">
                      {cv.sections.length}
                    </span>
                    <span className="cv-template-two__metric-label">Sections</span>
                  </div>
                  <div className="cv-template-two__metric">
                    <span className="cv-template-two__metric-value">
                      {totalEntries}
                    </span>
                    <span className="cv-template-two__metric-label">Entries</span>
                  </div>
                </div>

                <div className="cv-template-two__outline">
                  {cv.sections.map((section) => (
                    <div
                      key={`template-two-outline-${section.title}`}
                      className="cv-template-two__outline-item"
                    >
                      <span>{section.title}</span>
                      <span>{section.entries.length}</span>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
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
}: {
  bullets: string[];
  className?: string;
  itemClassName?: string;
  bulletClassName?: string;
  textClassName?: string;
}) {
  return (
    <ul className={className}>
      {bullets.map((bullet, bulletIndex) => (
        <li key={`${bullet}-${bulletIndex}`} className={itemClassName}>
          <span className={bulletClassName} aria-hidden="true">
            •
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
    color: #0f172a;
    font-family: "Lato", Arial, Helvetica, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cv-document--preview {
    width: 210mm;
    margin: 0 auto;
    zoom: var(--cv-preview-zoom, 1);
  }

  .cv-template-two__page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 12mm 14mm;
    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 28%);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
  }

  .cv-template-two__header {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    padding-bottom: 10px;
    border-bottom: 2px solid #0f766e;
  }

  .cv-template-two__name {
    margin: 0;
    font-size: 31px;
    font-weight: 800;
    letter-spacing: 0.03em;
  }

  .cv-template-two__role {
    margin: 5px 0 0;
    color: #115e59;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.28em;
    text-transform: uppercase;
  }

  .cv-template-two__contact {
    max-width: 78mm;
    padding-top: 4px;
  }

  .cv-template-two__contact-line {
    text-align: right;
    font-size: 12px;
    line-height: 1.45;
  }

  .cv-template-two__contact-link {
    color: #0f766e;
    text-decoration: none;
  }

  .cv-template-two__body {
    margin-top: 10px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 56mm;
    gap: 12px;
  }

  .cv-template-two__main {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cv-template-two__profile-card,
  .cv-template-two__panel,
  .cv-template-two__entry {
    border: 1px solid #d6dfe5;
    border-radius: 18px;
    background: #ffffff;
  }

  .cv-template-two__profile-card {
    padding: 12px 14px;
  }

  .cv-template-two__eyebrow,
  .cv-template-two__panel-label {
    margin: 0 0 8px;
    color: #0f766e;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .cv-template-two__profile-copy {
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
  }

  .cv-template-two__section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cv-template-two__section-heading {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cv-template-two__section-index {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: #ccfbf1;
    color: #115e59;
    font-size: 11px;
    font-weight: 700;
  }

  .cv-template-two__section-title {
    margin: 0;
    font-size: 17px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .cv-template-two__entries {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cv-template-two__entry {
    padding: 12px 14px;
  }

  .cv-template-two__entry-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
  }

  .cv-template-two__entry-title,
  .cv-template-two__entry-date,
  .cv-template-two__organization,
  .cv-template-two__skill-items {
    margin: 0;
  }

  .cv-template-two__entry-title {
    font-size: 15px;
    font-weight: 800;
  }

  .cv-template-two__entry-date {
    margin-top: 2px;
    color: #0f766e;
    font-size: 12px;
    font-weight: 700;
  }

  .cv-template-two__resource {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    color: #115e59;
    font-size: 12px;
  }

  .cv-template-two__resource-link,
  .cv-template-two__organization-link {
    color: inherit;
    text-decoration: none;
  }

  .cv-template-two__organization {
    margin-top: 6px;
    color: #475569;
    font-size: 12px;
    line-height: 1.45;
  }

  .cv-template-two__stack {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }

  .cv-template-two__stack-tag {
    border-radius: 999px;
    background: #ecfeff;
    padding: 4px 9px;
    color: #0f766e;
    font-size: 11px;
    line-height: 1;
  }

  .cv-template-two__bullet-list {
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
  }

  .cv-template-two__bullet-item {
    display: grid;
    grid-template-columns: 10px 1fr;
    gap: 8px;
    align-items: start;
    margin-bottom: 4px;
    font-size: 12px;
    line-height: 1.45;
  }

  .cv-template-two__bullet-symbol {
    color: #0f766e;
  }

  .cv-template-two__bullet-text {
    min-width: 0;
  }

  .cv-template-two__sidebar {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cv-template-two__panel {
    padding: 12px;
  }

  .cv-template-two__skill-groups {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cv-template-two__skill-label {
    margin: 0 0 4px;
    font-size: 12px;
    font-weight: 800;
    color: #0f172a;
  }

  .cv-template-two__skill-items {
    font-size: 12px;
    line-height: 1.5;
    color: #475569;
  }

  .cv-template-two__metrics {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-bottom: 10px;
  }

  .cv-template-two__metric {
    border-radius: 14px;
    background: #f0fdfa;
    padding: 10px;
    text-align: center;
  }

  .cv-template-two__metric-value {
    display: block;
    color: #0f766e;
    font-size: 18px;
    font-weight: 800;
  }

  .cv-template-two__metric-label {
    display: block;
    margin-top: 4px;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #475569;
  }

  .cv-template-two__outline {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .cv-template-two__outline-item {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    border-top: 1px solid #e2e8f0;
    padding-top: 6px;
    font-size: 12px;
    color: #334155;
  }

  @media print {
    .cv-document--preview {
      width: auto;
      margin: 0;
      zoom: 1;
    }

    .cv-template-two__page {
      box-shadow: none;
    }
  }
`;
