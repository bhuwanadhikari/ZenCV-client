import { Download } from "lucide-react";

import { CV_OWNER_NAME } from "../../constants/constants";
import { cvTemplateStyles } from "../../constants/cvStyles";
import { useCV } from "../../hooks/useCV";

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



type CvTabBodyProps = {
  pageTitleFirstWord?: string;
};

export function CvTabBody({ pageTitleFirstWord = "" }: CvTabBodyProps) {
  const {
    previewViewportRef,
    cvTemplateRef,
    previewZoom,
    downloadError,
    handleDownloadPdf,
    isDownloading,
  } = useCV(pageTitleFirstWord);
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
            <h1 className="cv-document__name">{CV_OWNER_NAME}</h1>
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
