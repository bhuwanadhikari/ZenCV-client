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
            <div className="cv-template-two__header-left">
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
                          <div className="cv-template-two__entry-header">
                            <h3 className="cv-template-two__entry-title">
                              {entry.title}
                            </h3>
                            <span className="cv-template-two__entry-date">
                              {entry.dateRange}
                            </span>
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
                              target="_blank"
                              rel="noreferrer"
                            >
                              {entry.organization.name}
                            </a>
                          ) : (
                            <span className="cv-template-two__organization-name">
                              {entry.organization.name}
                            </span>
                          )}
                          {entry.organization.address && (
                            <span className="cv-template-two__organization-address">
                              {` • ${entry.organization.address}`}
                            </span>
                          )}
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
                <p className="cv-template-two__panel-label">Skills & Tech</p>
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

              <section className="cv-template-two__panel cv-template-two__panel--snapshot">
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
                      <span className="cv-template-two__outline-title">{section.title}</span>
                      <span className="cv-template-two__outline-count">{section.entries.length}</span>
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
        <span key={`${item.label ?? item.value}-${itemIndex}`} className="cv-template-two__contact-span">
          {itemIndex > 0 ? <span className="cv-template-two__contact-separator">{separator}</span> : null}
          {item.label ? <strong className="cv-template-two__contact-label">{item.label}: </strong> : null}
          {item.href ? (
            <a href={item.href} className={linkClassName} target="_blank" rel="noreferrer">
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
  if (!resource) return null;

  return (
    <span className={className}>
      {resource.url ? (
        <a href={resource.url} className={linkClassName} target="_blank" rel="noreferrer">
          {resource.placeholder}
          <LinkResourceIcon />
        </a>
      ) : (
        <span className="cv-template-two__resource-text">
          {resource.placeholder}
        </span>
      )}
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
  if (!bullets || bullets.length === 0) return null;
  
  return (
    <ul className={className}>
      {bullets.map((bullet, bulletIndex) => (
        <li key={`${bullet.substring(0, 10)}-${bulletIndex}`} className={itemClassName}>
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
      width="12"
      height="12"
      aria-hidden="true"
      focusable="false"
      style={{ marginLeft: '4px', verticalAlign: '-1px' }}
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
    margin: 0;
  }

  .cv-document,
  .cv-document * {
    box-sizing: border-box;
  }

  .cv-document {
    margin: 0;
    padding: 0;
    background: transparent;
    color: #1e293b;
    font-family: "Lato", Arial, Helvetica, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    line-height: 1.5;
  }

  .cv-document--preview {
    width: 210mm;
    margin: 20px auto;
    zoom: var(--cv-preview-zoom, 1);
  }

  .cv-template-two__page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 14mm 16mm;
    background: #ffffff;
    box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
  }

  /* --- HEADER --- */
  .cv-template-two__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 14px;
    border-bottom: 2px solid #0f766e;
    margin-bottom: 16px;
  }

  .cv-template-two__name {
    margin: 0;
    color: #0f172a;
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.01em;
    line-height: 1.1;
  }

  .cv-template-two__role {
    margin: 6px 0 0;
    color: #0f766e;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .cv-template-two__contact {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  .cv-template-two__contact-line {
    font-size: 11.5px;
    color: #475569;
  }

  .cv-template-two__contact-label {
    font-weight: 700;
    color: #1e293b;
  }

  .cv-template-two__contact-link {
    color: #0f766e;
    text-decoration: none;
    transition: color 0.15s ease;
  }
  
  .cv-template-two__contact-link:hover {
    color: #115e59;
    text-decoration: underline;
  }

  .cv-template-two__contact-separator {
    color: #cbd5e1;
    margin: 0 6px;
  }

  /* --- LAYOUT --- */
  .cv-template-two__body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 62mm;
    gap: 20px;
    align-items: start;
  }

  .cv-template-two__main {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .cv-template-two__sidebar {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* --- CARDS & PANELS --- */
  .cv-template-two__profile-card,
  .cv-template-two__panel,
  .cv-template-two__entry {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    padding: 14px 16px;
  }

  .cv-template-two__panel {
    background: #f8fafc;
    border-color: #f1f5f9;
  }

  .cv-template-two__eyebrow,
  .cv-template-two__panel-label {
    margin: 0 0 10px;
    color: #0f766e;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 6px;
  }

  .cv-template-two__profile-copy {
    margin: 0;
    font-size: 13px;
    color: #334155;
    line-height: 1.6;
  }

  /* --- MAIN SECTIONS --- */
  .cv-template-two__section {
    display: flex;
    flex-direction: column;
    gap: 12px;
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
    width: 26px;
    height: 26px;
    border-radius: 6px;
    background: #ccfbf1;
    color: #0f766e;
    font-size: 12px;
    font-weight: 800;
  }

  .cv-template-two__section-title {
    margin: 0;
    color: #0f172a;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .cv-template-two__entries {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* --- ENTRY STYLING --- */
  .cv-template-two__entry-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 4px;
  }

  .cv-template-two__entry-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .cv-template-two__entry-title {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
  }

  .cv-template-two__entry-date {
    font-size: 11.5px;
    font-weight: 700;
    color: #0f766e;
    background: #ccfbf1;
    padding: 2px 8px;
    border-radius: 4px;
  }

  .cv-template-two__organization {
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 700;
    color: #475569;
  }

  .cv-template-two__organization-link {
    color: #334155;
    text-decoration: underline;
    text-decoration-color: #cbd5e1;
    text-underline-offset: 2px;
  }

  .cv-template-two__organization-address {
    font-weight: 400;
    color: #64748b;
  }

  .cv-template-two__resource-link {
    display: inline-flex;
    align-items: center;
    font-size: 11.5px;
    font-weight: 700;
    color: #0ea5e9;
    text-decoration: none;
    background: #f0f9ff;
    padding: 3px 8px;
    border-radius: 4px;
  }

  /* --- TAGS & SKILLS --- */
  .cv-template-two__stack {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }

  .cv-template-two__stack-tag {
    font-size: 11px;
    font-weight: 700;
    color: #334155;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    padding: 2px 8px;
    border-radius: 4px;
  }

  /* --- BULLETS --- */
  .cv-template-two__bullet-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .cv-template-two__bullet-item {
    display: flex;
    align-items: flex-start;
    font-size: 12.5px;
    color: #334155;
    line-height: 1.5;
  }

  .cv-template-two__bullet-symbol {
    color: #0f766e;
    font-weight: 800;
    margin-right: 8px;
    font-size: 14px;
    line-height: 1.3;
  }

  /* --- SIDEBAR SKILLS --- */
  .cv-template-two__skill-groups {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .cv-template-two__skill-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .cv-template-two__skill-label {
    margin: 0;
    font-size: 12px;
    font-weight: 800;
    color: #1e293b;
  }

  .cv-template-two__skill-items {
    margin: 0;
    font-size: 12.5px;
    color: #475569;
    line-height: 1.5;
  }

  /* --- SIDEBAR SNAPSHOT METRICS --- */
  .cv-template-two__metrics {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .cv-template-two__metric {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 4px;
  }

  .cv-template-two__metric-value {
    font-size: 20px;
    font-weight: 800;
    color: #0f766e;
    line-height: 1;
  }

  .cv-template-two__metric-label {
    font-size: 10px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    margin-top: 4px;
  }

  .cv-template-two__outline {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cv-template-two__outline-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    padding-bottom: 6px;
    border-bottom: 1px dashed #cbd5e1;
  }

  .cv-template-two__outline-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .cv-template-two__outline-title {
    color: #334155;
    font-weight: 700;
  }

  .cv-template-two__outline-count {
    background: #e2e8f0;
    color: #475569;
    font-size: 10px;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 10px;
  }
`;