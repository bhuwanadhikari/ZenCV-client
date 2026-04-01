import { forwardRef } from "react";
import latoRegularUrl from "@/fonts/lato/Lato-Regular.ttf";
import latoBoldUrl from "@/fonts/lato/Lato-Bold.ttf";
import latoItalicUrl from "@/fonts/lato/Lato-Italic.ttf";
import latoBoldItalicUrl from "@/fonts/lato/Lato-BoldItalic.ttf";

import type { CvContactItem, CvData, CvEntry } from "@/constants/cvData";

type CVTemplate5Props = {
  cv: CvData;
  previewZoom: number;
};

export const CVTemplate5 = forwardRef<HTMLElement, CVTemplate5Props>(
  function CVTemplate5({ cv, previewZoom }, ref) {
    return (
      <article
        ref={ref}
        className="cv-document cv-document--preview cv-template-five"
        style={getPreviewDocumentStyle(previewZoom)}
      >
        <style>{styles}</style>

        <div className="cv-template-five__page">
          <header className="cv-template-five__hero">
            <div>
              <p className="cv-template-five__eyebrow">{cv.role}</p>
              <h1 className="cv-template-five__name">{cv.name}</h1>
            </div>

            <div className="cv-template-five__contacts">
              {cv.contactLines.map((line, lineIndex) => (
                <ContactLine
                  key={`template-five-contact-${lineIndex}`}
                  line={line}
                  className="cv-template-five__contact-line"
                  linkClassName="cv-template-five__contact-link"
                  separator=" · "
                />
              ))}
            </div>
          </header>

          <section className="cv-template-five__profile">
            <p className="cv-template-five__profile-label">{cv.profile.label}</p>
            <p className="cv-template-five__profile-copy">{cv.profile.summary}</p>
          </section>

          <section className="cv-template-five__skills">
            {cv.skillGroups.map((skillGroup) => (
              <div key={skillGroup.label} className="cv-template-five__skill-row">
                <span className="cv-template-five__skill-heading">
                  {skillGroup.label}
                </span>
                <div className="cv-template-five__skill-chips">
                  {skillGroup.items.map((item) => (
                    <span
                      key={`${skillGroup.label}-${item}`}
                      className="cv-template-five__chip"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <main className="cv-template-five__sections">
            {cv.sections.map((section) => (
              <section key={section.title} className="cv-template-five__section">
                <div className="cv-template-five__section-label-wrap">
                  <h2 className="cv-template-five__section-label">
                    {section.title}
                  </h2>
                </div>

                <div className="cv-template-five__section-body">
                  {section.entries.map((entry) => (
                    <article
                      key={`${entry.title}-${entry.dateRange}`}
                      className="cv-template-five__entry"
                    >
                      <div className="cv-template-five__entry-header">
                        <div>
                          <p className="cv-template-five__entry-title">
                            {entry.title}
                          </p>
                          <p className="cv-template-five__entry-subtitle">
                            {entry.organization.url ? (
                              <a
                                href={entry.organization.url}
                                className="cv-template-five__org-link"
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

                        <div className="cv-template-five__entry-right">
                          <span className="cv-template-five__date-pill">
                            {entry.dateRange}
                          </span>
                          <ResourceLink
                            resource={entry.resource}
                            className="cv-template-five__resource"
                            linkClassName="cv-template-five__resource-link"
                          />
                        </div>
                      </div>

                      {entry.stack?.length ? (
                        <p className="cv-template-five__stack">
                          {entry.stack.join(" / ")}
                        </p>
                      ) : null}

                      <BulletList
                        bullets={entry.bullets}
                        className="cv-template-five__bullet-list"
                        itemClassName="cv-template-five__bullet-item"
                        bulletClassName="cv-template-five__bullet-symbol"
                        textClassName="cv-template-five__bullet-text"
                      />
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
    color: #1f2933;
    font-family: "Lato", Arial, Helvetica, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cv-document--preview {
    width: 210mm;
    margin: 0 auto;
    zoom: var(--cv-preview-zoom, 1);
  }

  .cv-template-five__page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 11mm 15mm 12mm;
    background: #fffdf8;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
  }

  .cv-template-five__hero {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 18px;
    border-radius: 24px;
    background: #111827;
    color: #f8fafc;
  }

  .cv-template-five__eyebrow {
    margin: 0 0 8px;
    color: #fbbf24;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.26em;
    text-transform: uppercase;
  }

  .cv-template-five__name {
    margin: 0;
    font-family: "Lato", Arial, Helvetica, sans-serif;
    font-size: 32px;
    line-height: 1;
    font-weight: 700;
  }

  .cv-template-five__contacts {
    align-self: flex-end;
    max-width: 76mm;
  }

  .cv-template-five__contact-line {
    text-align: right;
    color: #d1d5db;
    font-size: 12px;
    line-height: 1.45;
  }

  .cv-template-five__contact-link,
  .cv-template-five__org-link,
  .cv-template-five__resource-link {
    color: inherit;
    text-decoration: none;
  }

  .cv-template-five__profile {
    margin-top: 12px;
    padding: 12px 2px 14px;
    border-bottom: 1px solid #d6d3d1;
  }

  .cv-template-five__profile-label {
    margin: 0 0 6px;
    color: #9a3412;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }

  .cv-template-five__profile-copy {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
  }

  .cv-template-five__skills {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }

  .cv-template-five__skill-row {
    display: grid;
    grid-template-columns: 34mm minmax(0, 1fr);
    gap: 10px;
    align-items: start;
  }

  .cv-template-five__skill-heading {
    color: #9a3412;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .cv-template-five__skill-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .cv-template-five__chip {
    border-radius: 999px;
    border: 1px solid #fed7aa;
    background: #fff7ed;
    padding: 4px 8px;
    color: #9a3412;
    font-size: 11px;
    line-height: 1;
  }

  .cv-template-five__sections {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 14px;
  }

  .cv-template-five__section {
    display: grid;
    grid-template-columns: 34mm minmax(0, 1fr);
    gap: 12px;
  }

  .cv-template-five__section-label-wrap {
    padding-top: 4px;
  }

  .cv-template-five__section-label {
    margin: 0;
    color: #111827;
    font-family: "Lato", Arial, Helvetica, sans-serif;
    font-size: 17px;
    line-height: 1.2;
    font-weight: 700;
  }

  .cv-template-five__section-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cv-template-five__entry {
    border-top: 1px solid #e5e7eb;
    padding-top: 10px;
  }

  .cv-template-five__entry:first-child {
    border-top: 0;
    padding-top: 0;
  }

  .cv-template-five__entry-header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .cv-template-five__entry-title,
  .cv-template-five__entry-subtitle,
  .cv-template-five__stack {
    margin: 0;
  }

  .cv-template-five__entry-title {
    font-size: 15px;
    font-weight: 800;
  }

  .cv-template-five__entry-subtitle {
    margin-top: 4px;
    color: #6b7280;
    font-size: 12px;
    line-height: 1.45;
  }

  .cv-template-five__entry-right {
    min-width: 31mm;
    text-align: right;
  }

  .cv-template-five__date-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #fff7ed;
    padding: 4px 9px;
    color: #9a3412;
    font-size: 11px;
    font-weight: 700;
  }

  .cv-template-five__resource {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 7px;
    color: #6b7280;
    font-size: 12px;
  }

  .cv-template-five__stack {
    margin-top: 7px;
    color: #4b5563;
    font-size: 11px;
    font-style: italic;
  }

  .cv-template-five__bullet-list {
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
  }

  .cv-template-five__bullet-item {
    display: grid;
    grid-template-columns: 10px 1fr;
    gap: 8px;
    margin-bottom: 4px;
    font-size: 12px;
    line-height: 1.5;
  }

  .cv-template-five__bullet-symbol {
    color: #b45309;
  }

  .cv-template-five__bullet-text {
    min-width: 0;
  }

  @media print {
    .cv-document--preview {
      width: auto;
      margin: 0;
      zoom: 1;
    }

    .cv-template-five__page {
      box-shadow: none;
    }
  }
`;
