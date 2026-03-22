import kollektifRegularUrl from "@/fonts/Kollektif.ttf";
import kollektifBoldUrl from "@/fonts/Kollektif-Bold.ttf";
import kollektifItalicUrl from "@/fonts/Kollektif-Italic.ttf";
import kollektifBoldItalicUrl from "@/fonts/Kollektif-BoldItalic.ttf";

export const cvTemplateStyles = `
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
    font-size: var(--font-size-body);
    line-height: 1.4;
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

  .cv-document__org-line em {
    font-style: italic;
    text-decoration: underline;
  }

  .cv-document__org-line a {
    color: inherit;
    text-decoration: none;
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

export const errorStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "12px",
  color: "#be123c",
};

export const buttonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  borderRadius: "999px",
  border: "1px solid #a5f3fc",
  background: "#ecfeff",
  padding: "8px 10px",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#155e75",
  cursor: "pointer",
};

export const disabledButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  opacity: 0.7,
  cursor: "not-allowed",
};

export const previewViewportStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflow: "auto",
  marginTop: "8px",
};

export const contentErrorStyle: React.CSSProperties = {
  margin: 0,
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid #fecdd3",
  background: "#fff1f2",
  fontSize: "13px",
  color: "#9f1239",
};
