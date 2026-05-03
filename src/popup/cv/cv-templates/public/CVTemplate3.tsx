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
            <div className="cv-template-three__avatar-wrap">
              <div className="cv-template-three__avatar">
                {cv.photo ? (
                  <img
                    src={cv.photo}
                    alt={`${cv.name} photo`}
                    className="cv-template-three__avatar-image"
                  />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                )}
              </div>
            </div>

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
              <section
                key={section.title}
                className="cv-template-three__section"
              >
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
                      <span
                        className="cv-template-three__dot"
                        aria-hidden="true"
                      />

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
  // Render certain contact items as block elements (one per line):
  // address, email, github, linkedin — or when value looks like an email or href indicates these.
  function shouldBreak(item: CvContactItem) {
    const label = (item.label || "").toLowerCase();
    const href = (item.href || "").toLowerCase();
    const value = (item.value || "").toLowerCase();

    if (
      label.includes("address") ||
      label.includes("email") ||
      label.includes("github") ||
      label.includes("linkedin") ||
      label.includes("portfolio")
    ) {
      return true;
    }

    if (
      href.includes("mailto:") ||
      href.includes("github.com") ||
      href.includes("linkedin.com")
    ) {
      return true;
    }

    if (value.includes("@")) {
      return true;
    }

    return false;
  }

  let prevWasInline = false;

  return (
    <div className={className}>
      {line.map((item, itemIndex) => {
        const isBreak = shouldBreak(item);
        if (isBreak) {
          prevWasInline = false;
          return (
            <div
              key={`${item.label ?? item.value}-${itemIndex}`}
              className="cv-template-three__contact-item"
            >
              {item.label ? `${item.label}: ` : null}
              {item.href ? (
                <a href={item.href} className={linkClassName}>
                  {item.value}
                </a>
              ) : (
                item.value
              )}
            </div>
          );
        }

        const showSeparator = prevWasInline && itemIndex > 0;
        prevWasInline = true;

        return (
          <span key={`${item.label ?? item.value}-${itemIndex}`}>
            {showSeparator ? separator : null}
            {item.label ? `${item.label}: ` : null}
            {item.href ? (
              <a href={item.href} className={linkClassName}>
                {item.value}
              </a>
            ) : (
              item.value
            )}
          </span>
        );
      })}
    </div>
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
    grid-template-columns: 72mm minmax(0, 1fr);
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    background: #ffffff;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
  }

  /* ── Sidebar ── */

  .cv-template-three__sidebar {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 12mm 8mm;
    background: #f8fafc;
    color: #0f172a;
    border-right: 1px solid #e2e8f0;
  }

  .cv-template-three__avatar-wrap {
    display: flex;
    justify-content: flex-start;
  }

  .cv-template-three__avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #e2e8f0;
    border: 2px solid #0ea5e9;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cv-template-three__avatar svg {
    width: 40px;
    height: 40px;
    color: #94a3b8;
  }

  .cv-template-three__avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .cv-template-three__name {
    margin: 0;
    font-size: 30px;
    line-height: 1.05;
    font-weight: 800;
  }

  .cv-template-three__role {
    margin: 5px 0 0;
    color: #0369a1;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    line-height: 1.4;
  }

  .cv-template-three__sidebar-section {
    border-top: 1px solid #e2e8f0;
    padding-top: 10px;
  }

  .cv-template-three__label {
    margin: 0 0 6px;
    color: #0284c7;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .cv-template-three__summary,
  .cv-template-three__skill-items {
    margin: 0;
    font-size: 12px;
    line-height: 1.58;
    color: #334155;
  }

  .cv-template-three__contact-stack,
  .cv-template-three__skill-groups {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .cv-template-three__contact-line {
    font-size: 12px;
    line-height: 1.45;
    color: #475569;
  }

  .cv-template-three__contact-link {
    color: #0369a1;
    text-decoration: none;
  }

  .cv-template-three__separator {
    margin: 0 3px;
    color: #94a3b8;
  }

  .cv-template-three__contact-item {
    display: block;
    margin-top: 2px;
  }

  .cv-template-three__skill-name {
    margin: 0 0 3px;
    color: #0f172a;
    font-size: 12px;
    font-weight: 800;
  }

  /* ── Main ── */

  .cv-template-three__main {
    padding: 11mm 13mm 10mm 6mm;
  }

  .cv-template-three__section + .cv-template-three__section {
    margin-top: 10px;
  }

  .cv-template-three__section-heading {
    padding-bottom: 5px;
    border-bottom: 1.5px solid #0ea5e9;
  }

  .cv-template-three__section-title {
    margin: 0;
    color: #0f172a;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* ── Timeline ── */

  .cv-template-three__timeline {
    position: relative;
    margin-top: 8px;
    padding-left: 18px;
  }

  .cv-template-three__timeline::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 4px;
    width: 2px;
    background: #e2e8f0;
  }

  .cv-template-three__entry {
    position: relative;
    margin-bottom: 9px;
  }

  /*
   * Dot alignment: card padding-top (9px) + half title line-height (13.5px * 1.2 / 2 ≈ 8px)
   * − half dot height (5px) = 12px → rounded to 17px for optical balance.
   */
  .cv-template-three__dot {
    position: absolute;
    left: -18px;
    top: 12px;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #0ea5e9;
    border: 2px solid #ffffff;
    box-shadow: 0 0 0 2px #e0f2fe;
  }

  .cv-template-three__entry-card {
    padding: 9px 10px;
  }

  .cv-template-three__entry-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
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
    line-height: 1.2;
  }

  .cv-template-three__entry-meta {
    margin-top: 2px;
    color: #0369a1;
    font-size: 12px;
    font-weight: 700;
  }

  .cv-template-three__organization {
    margin-top: 5px;
    color: #475569;
    font-size: 12px;
    line-height: 1.45;
  }

  .cv-template-three__organization-link,
  .cv-template-three__contact-link {
    color: inherit;
    text-decoration: none;
  }

  .cv-template-three__stack {
    margin-top: 4px;
    color: #334155;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .cv-template-three__bullet-list {
    margin: 6px 0 0;
    padding: 0;
    list-style: none;
  }

  .cv-template-three__bullet-item {
    display: grid;
    grid-template-columns: 10px 1fr;
    gap: 6px;
    align-items: start;
    margin-bottom: 3px;
    font-size: 12px;
    line-height: 1.5;
  }

  .cv-template-three__bullet-symbol {
    color: #0ea5e9;
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
