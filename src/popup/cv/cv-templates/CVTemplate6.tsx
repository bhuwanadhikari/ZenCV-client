import { forwardRef } from "react";
import kollektifRegularUrl from "@/fonts/Kollektif.ttf";
import kollektifBoldUrl from "@/fonts/Kollektif-Bold.ttf";
import kollektifItalicUrl from "@/fonts/Kollektif-Italic.ttf";
import kollektifBoldItalicUrl from "@/fonts/Kollektif-BoldItalic.ttf";

import type { CvContactItem, CvData, CvEntry } from "@/constants/cvData";

type CVTemplate6Props = {
  cv: CvData;
  previewZoom: number;
};

export const CVTemplate6 = forwardRef<HTMLElement, CVTemplate6Props>(
  function CVTemplate6({ cv, previewZoom }, ref) {
    return (
      <article
        ref={ref}
        className="cv-document cv-document--preview cv-template-six"
        style={getPreviewDocumentStyle(previewZoom)}
      >
        <style>{styles}</style>

        <div className="cv-template-six__page">
          <header className="cv-template-six__header">
            <div className="cv-template-six__badge">{getNameInitials(cv.name)}</div>

            <div className="cv-template-six__header-body">
              <div className="cv-template-six__heading">
                <div>
                  <h1 className="cv-template-six__name">{cv.name}</h1>
                  <p className="cv-template-six__role">{cv.role}</p>
                </div>
              </div>

              <div className="cv-template-six__contacts">
                {cv.contactLines.map((line, lineIndex) => (
                  <ContactLine
                    key={`template-six-contact-${lineIndex}`}
                    line={line}
                    className="cv-template-six__contact-line"
                    linkClassName="cv-template-six__contact-link"
                    separator=" • "
                  />
                ))}
              </div>
            </div>
          </header>

          <div className="cv-template-six__intro-grid">
            <section className="cv-template-six__card cv-template-six__card--profile">
              <p className="cv-template-six__card-label">{cv.profile.label}</p>
              <p className="cv-template-six__summary">{cv.profile.summary}</p>
            </section>

            <section className="cv-template-six__card">
              <p className="cv-template-six__card-label">Skills</p>
              <div className="cv-template-six__skill-groups">
                {cv.skillGroups.map((skillGroup) => (
                  <div
                    key={skillGroup.label}
                    className="cv-template-six__skill-group"
                  >
                    <h3 className="cv-template-six__skill-label">
                      {skillGroup.label}
                    </h3>
                    <div className="cv-template-six__skill-tags">
                      {skillGroup.items.map((item) => (
                        <span
                          key={`${skillGroup.label}-${item}`}
                          className="cv-template-six__skill-tag"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <main className="cv-template-six__sections">
            {cv.sections.map((section) => (
              <section key={section.title} className="cv-template-six__section">
                <div className="cv-template-six__section-header">
                  <h2 className="cv-template-six__section-title">
                    {section.title}
                  </h2>
                </div>

                <div className="cv-template-six__entries">
                  {section.entries.map((entry) => (
                    <article
                      key={`${entry.title}-${entry.dateRange}`}
                      className="cv-template-six__entry"
                    >
                      <div className="cv-template-six__entry-header">
                        <div>
                          <p className="cv-template-six__entry-title">
                            {entry.title}
                          </p>
                          <p className="cv-template-six__entry-subtitle">
                            {entry.organization.url ? (
                              <a
                                href={entry.organization.url}
                                className="cv-template-six__org-link"
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

                        <div className="cv-template-six__entry-aside">
                          <span className="cv-template-six__entry-date">
                            {entry.dateRange}
                          </span>
                          <ResourceLink
                            resource={entry.resource}
                            className="cv-template-six__resource"
                            linkClassName="cv-template-six__resource-link"
                          />
                        </div>
                      </div>

                      {entry.stack?.length ? (
                        <div className="cv-template-six__stack-tags">
                          {entry.stack.map((item) => (
                            <span
                              key={`${entry.title}-${item}`}
                              className="cv-template-six__stack-tag"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <BulletList
                        bullets={entry.bullets}
                        className="cv-template-six__bullet-list"
                        itemClassName="cv-template-six__bullet-item"
                        bulletClassName="cv-template-six__bullet-symbol"
                        textClassName="cv-template-six__bullet-text"
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

function getNameInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join("");

  return initials || "CV";
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
    font-family: "Kollektif", Arial, Helvetica, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cv-document--preview {
    width: 210mm;
    margin: 0 auto;
    zoom: var(--cv-preview-zoom, 1);
  }

  .cv-template-six__page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 12mm 14mm;
    background:
      radial-gradient(circle at top right, rgba(250, 204, 21, 0.16), transparent 26%),
      linear-gradient(180deg, #ffffff 0%, #fff7ed 100%);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
  }

  .cv-template-six__header {
    display: grid;
    grid-template-columns: 54px minmax(0, 1fr);
    gap: 14px;
    align-items: start;
  }

  .cv-template-six__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    border-radius: 18px;
    background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
    color: #ffffff;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 0.08em;
  }

  .cv-template-six__header-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cv-template-six__heading {
    display: flex;
    justify-content: space-between;
    gap: 14px;
  }

  .cv-template-six__name {
    margin: 0;
    font-size: 31px;
    font-weight: 800;
  }

  .cv-template-six__role {
    margin: 4px 0 0;
    color: #9a3412;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .cv-template-six__contacts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px 14px;
    padding: 10px 12px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid #fed7aa;
  }

  .cv-template-six__contact-line {
    font-size: 12px;
    line-height: 1.45;
    color: #7c2d12;
  }

  .cv-template-six__contact-link,
  .cv-template-six__org-link,
  .cv-template-six__resource-link {
    color: inherit;
    text-decoration: none;
  }

  .cv-template-six__intro-grid {
    display: grid;
    grid-template-columns: 70mm minmax(0, 1fr);
    gap: 12px;
    margin-top: 12px;
  }

  .cv-template-six__card {
    border-radius: 22px;
    border: 1px solid #fde68a;
    background: rgba(255, 255, 255, 0.9);
    padding: 14px;
  }

  .cv-template-six__card--profile {
    background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%);
  }

  .cv-template-six__card-label {
    margin: 0 0 8px;
    color: #b45309;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .cv-template-six__summary {
    margin: 0;
    font-size: 12px;
    line-height: 1.6;
  }

  .cv-template-six__skill-groups {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cv-template-six__skill-label {
    margin: 0 0 5px;
    color: #111827;
    font-size: 12px;
    font-weight: 800;
  }

  .cv-template-six__skill-tags,
  .cv-template-six__stack-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .cv-template-six__skill-tag,
  .cv-template-six__stack-tag {
    border-radius: 999px;
    padding: 4px 8px;
    font-size: 11px;
    line-height: 1;
  }

  .cv-template-six__skill-tag {
    background: #fff7ed;
    color: #9a3412;
    border: 1px solid #fed7aa;
  }

  .cv-template-six__sections {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 14px;
  }

  .cv-template-six__section-header {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cv-template-six__section-header::before {
    content: "";
    width: 18px;
    height: 18px;
    border-radius: 6px;
    background: linear-gradient(135deg, #f59e0b 0%, #fb923c 100%);
  }

  .cv-template-six__section-title {
    margin: 0;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .cv-template-six__entries {
    display: flex;
    flex-direction: column;
    gap: 9px;
    margin-top: 8px;
  }

  .cv-template-six__entry {
    border-radius: 18px;
    border: 1px solid #fde68a;
    background: rgba(255, 255, 255, 0.95);
    padding: 12px 13px;
  }

  .cv-template-six__entry-header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .cv-template-six__entry-title,
  .cv-template-six__entry-subtitle {
    margin: 0;
  }

  .cv-template-six__entry-title {
    font-size: 15px;
    font-weight: 800;
  }

  .cv-template-six__entry-subtitle {
    margin-top: 4px;
    color: #6b7280;
    font-size: 12px;
    line-height: 1.45;
  }

  .cv-template-six__entry-aside {
    min-width: 31mm;
    text-align: right;
  }

  .cv-template-six__entry-date {
    display: inline-block;
    border-radius: 999px;
    background: #ffedd5;
    padding: 4px 9px;
    color: #9a3412;
    font-size: 11px;
    font-weight: 700;
  }

  .cv-template-six__resource {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 7px;
    color: #7c2d12;
    font-size: 12px;
  }

  .cv-template-six__stack-tags {
    margin-top: 8px;
  }

  .cv-template-six__stack-tag {
    background: #fff7ed;
    color: #9a3412;
  }

  .cv-template-six__bullet-list {
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
  }

  .cv-template-six__bullet-item {
    display: grid;
    grid-template-columns: 10px 1fr;
    gap: 8px;
    margin-bottom: 4px;
    font-size: 12px;
    line-height: 1.5;
  }

  .cv-template-six__bullet-symbol {
    color: #ea580c;
  }

  .cv-template-six__bullet-text {
    min-width: 0;
  }

  @media print {
    .cv-document--preview {
      width: auto;
      margin: 0;
      zoom: 1;
    }

    .cv-template-six__page {
      box-shadow: none;
    }
  }
`;
