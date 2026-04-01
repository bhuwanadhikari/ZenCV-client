import { getExtensionEnv } from "./env.shared";

export type PrintDocumentKind = "cover" | "cv";

const { fileNamePrefix } = getExtensionEnv(import.meta.env);

export function normalizePageTitle(value?: string | null) {
  return value?.trim() ?? "";
}

export function buildPrintDocumentTitle(
  kind: PrintDocumentKind,
  pageTitle: string,
) {
  const titleSuffix = formatPageTitleForFilename(pageTitle);
  const documentPrefix =
    kind === "cv" ? `${fileNamePrefix}_cv` : `${fileNamePrefix}_cover`;

  return titleSuffix
    ? `${documentPrefix}_${titleSuffix.split("_").slice(0, 6).join("_")}`
    : documentPrefix;
}

function formatPageTitleForFilename(pageTitle: string) {
  return normalizePageTitle(pageTitle)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
