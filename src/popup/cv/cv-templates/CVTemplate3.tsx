import { forwardRef } from "react";
import latoRegularUrl from "@/fonts/lato/Lato-Regular.ttf";
import latoBoldUrl from "@/fonts/lato/Lato-Bold.ttf";
import latoItalicUrl from "@/fonts/lato/Lato-Italic.ttf";
import latoBoldItalicUrl from "@/fonts/lato/Lato-BoldItalic.ttf";

import type { CvContactItem, CvData, CvEntry } from "@/constants/cvData";

type CVTemplate3Props = {
  cv: CvData;
  previewZoom: number;
};

export const CVTemplate3 = forwardRef<HTMLElement, CVTemplate3Props>(
  function CVTemplate3({ cv, previewZoom }, ref) {
    return (
      <article
        ref={ref}
        className="cv-document cv-document--preview cv-template-three"
        style={getPreviewDocumentStyle(previewZoom)}
      >
        <style>{styles}</style>

        <div className="cv-template-three__page">
          <aside className="cv-template-three__sidebar">
            <div>
              <h1 className="cv-template-three__name">{cv.name}</h1>
              <p className="cv-template-three__role">{cv.role}</p>
            </div>

            <section className="cv-template-three__sidebar-section">
              <p className="cv-template-three__label">{cv.profile.label}</p>
              <p className="cv-template-three__summary">{cv.profile.summary}</p>
            </section>

            <section className="cv-template-three__sidebar-section">
              <p className="cv-template-three__label">Contact</p>
              <div className="cv-template-three__contact-stack">
                {cv.contactLines.map((line, lineIndex) => (
                  <ContactLine
                    key={`template-three-contact-${lineIndex}`}
                    line={line}
                    className="cv-template-three__contact-line"
                    linkClassName="cv-template-three__contact-link"
                    separator={
                      <span className="cv-template-three__separator">/</span>
                    }
                  />
                ))}
              </div>
            </section>

            <section className="cv-template-three__sidebar-section">
              <p className="cv-template-three__label">Skills</p>
              <div className="cv-template-three__skill-groups">
                {cv.skillGroups.map((skillGroup) => (
                  <div
                    key={skillGroup.label}
                    className="cv-template-three__skill-group"
                  >
                    <h3 className="cv-template-three__skill-name">
                      {skillGroup.label}
                    </h3>
                    <p className="cv-template-three__skill-items">
                      {skillGroup.items.join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <main className="cv-template-three__main">
            {cv.sections.map((section) => (
              <section key={section.title} className="cv-template-three__section">
                <div className="cv-template-three__section-heading">
                  <h2 className="cv-template-three__section-title">
                    {section.title}
                  </h2>
                </div>

                <div className="cv-template-three__timeline">
                  {section.entries.map((entry) => (
                    <article
                      key={`${entry.title}-${entry.dateRange}`}
                      className="cv-template-three__entry"
                    >
                      <span className="cv-template-three__dot" aria-hidden="true" />

                      <div className="cv-template-three__entry-card">
                        <div className="cv-template-three__entry-header">
                          <div>
                            <p className="cv-template-three__entry-title">
                              {entry.title}
                            </p>
                            <p className="cv-template-three__entry-meta">
                              {entry.dateRange}
                            </p>
                          </div>

                          <ResourceLink
                            resource={entry.resource}
                            className="cv-template-three__resource"
                            linkClassName="cv-template-three__resource-link"
                          />
                        </div>

                        <p className="cv-template-three__organization">
                          {entry.organization.url ? (
                            <a
                              href={entry.organization.url}
                              className="cv-template-three__organization-link"
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
                          <p className="cv-template-three__stack">
                            {entry.stack.join(" / ")}
                          </p>
                        ) : null}

                        <BulletList
                          bullets={entry.bullets}
                          className="cv-template-three__bullet-list"
                          itemClassName="cv-template-three__bullet-item"
                          bulletClassName="cv-template-three__bullet-symbol"
                          textClassName="cv-template-three__bullet-text"
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </main>
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

  .cv-template-three__page {
    display: grid;
    grid-template-columns: 63mm minmax(0, 1fr);
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    background: #ffffff;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
  }

  .cv-template-three__sidebar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16mm 11mm;
    background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
    color: #e2e8f0;
  }

  .cv-template-three__name {
    margin: 0;
    font-size: 27px;
    line-height: 1.05;
    font-weight: 800;
  }

  .cv-template-three__role {
    margin: 8px 0 0;
    color: #93c5fd;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }

  .cv-template-three__sidebar-section {
    border-top: 1px solid rgba(148, 163, 184, 0.28);
    padding-top: 12px;
  }

  .cv-template-three__label {
    margin: 0 0 8px;
    color: #7dd3fc;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .cv-template-three__summary,
  .cv-template-three__skill-items {
    margin: 0;
    font-size: 12px;
    line-height: 1.58;
    color: #e2e8f0;
  }

  .cv-template-three__contact-stack,
  .cv-template-three__skill-groups {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cv-template-three__contact-line {
    font-size: 12px;
    line-height: 1.45;
    color: #cbd5e1;
  }

  .cv-template-three__contact-link,
  .cv-template-three__organization-link,
  .cv-template-three__resource-link {
    color: inherit;
    text-decoration: none;
  }

  .cv-template-three__separator {
    margin: 0 4px;
    color: #38bdf8;
  }

  .cv-template-three__skill-name {
    margin: 0 0 4px;
    color: #ffffff;
    font-size: 12px;
    font-weight: 800;
  }

  .cv-template-three__main {
    padding: 13mm 15mm 12mm 14mm;
  }

  .cv-template-three__section + .cv-template-three__section {
    margin-top: 12px;
  }

  .cv-template-three__section-heading {
    padding-bottom: 6px;
    border-bottom: 1px solid #cbd5e1;
  }

  .cv-template-three__section-title {
    margin: 0;
    color: #0f172a;
    font-size: 17px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .cv-template-three__timeline {
    position: relative;
    margin-top: 10px;
    padding-left: 16px;
  }

  .cv-template-three__timeline::before {
    content: "";
    position: absolute;
    top: 2px;
    bottom: 0;
    left: 4px;
    width: 2px;
    background: #cbd5e1;
  }

  .cv-template-three__entry {
    position: relative;
    margin-bottom: 10px;
  }

  .cv-template-three__dot {
    position: absolute;
    top: 8px;
    left: -16px;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #0ea5e9;
    border: 2px solid #ffffff;
    box-shadow: 0 0 0 2px #e0f2fe;
  }

  .cv-template-three__entry-card {
    border-radius: 16px;
    border: 1px solid #dbe4ee;
    background: #ffffff;
    padding: 11px 12px;
  }

  .cv-template-three__entry-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
  }

  .cv-template-three__entry-title,
  .cv-template-three__entry-meta,
  .cv-template-three__organization,
  .cv-template-three__stack {
    margin: 0;
  }

  .cv-template-three__entry-title {
    font-size: 15px;
    font-weight: 800;
  }

  .cv-template-three__entry-meta {
    margin-top: 3px;
    color: #0369a1;
    font-size: 12px;
    font-weight: 700;
  }

  .cv-template-three__resource {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #0369a1;
    font-size: 12px;
    white-space: nowrap;
  }

  .cv-template-three__organization {
    margin-top: 7px;
    color: #475569;
    font-size: 12px;
    line-height: 1.45;
  }

  .cv-template-three__stack {
    margin-top: 5px;
    color: #334155;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .cv-template-three__bullet-list {
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
  }

  .cv-template-three__bullet-item {
    display: grid;
    grid-template-columns: 10px 1fr;
    gap: 8px;
    align-items: start;
    margin-bottom: 4px;
    font-size: 12px;
    line-height: 1.45;
  }

  .cv-template-three__bullet-symbol {
    color: #0284c7;
  }

  .cv-template-three__bullet-text {
    min-width: 0;
  }

  @media print {
    .cv-document--preview {
      width: auto;
      margin: 0;
      zoom: 1;
    }

    .cv-template-three__page {
      box-shadow: none;
    }
  }
`;
