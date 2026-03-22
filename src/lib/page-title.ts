export type PrintDocumentKind = "cover" | "cv";

export function normalizePageTitle(value?: string | null) {
  return value?.trim() ?? "";
}

export function buildPrintDocumentTitle(
  kind: PrintDocumentKind,
  pageTitle: string,
) {
  const titleSuffix = formatPageTitleForFilename(pageTitle);
  const documentPrefix =
    kind === "cv" ? "bhuwan_adhikari_cv" : "bhuwan_adhikari_cover";

  return titleSuffix ? `${documentPrefix}_${titleSuffix.split("_").slice(0, 4).join("_")}` : documentPrefix;
}

function formatPageTitleForFilename(pageTitle: string) {
  return normalizePageTitle(pageTitle)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
