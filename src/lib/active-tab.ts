type GetActiveTabPageContextOptions = {
  includeHtml?: boolean;
};

export type ActiveTabPageContext = {
  pageHtml: string;
  pageTitle: string;
  pageTitleSnippet: string;
  pageUrl: string;
};

export async function getActiveTabPageContext({
  includeHtml = false,
}: GetActiveTabPageContextOptions = {}): Promise<ActiveTabPageContext> {
  if (!chrome?.tabs?.query) {
    throw new Error(
      "Chrome tab APIs are unavailable. Open this UI from the installed extension instead of the regular Vite web page."
    );
  }

  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!activeTab?.id) {
    throw new Error("No active tab found.");
  }

  const pageTitle = activeTab.title ?? "";
  const pageUrl = activeTab.url ?? "";
  const pageTitleSnippet = extractFirstTwoWords(pageTitle);

  if (!includeHtml) {
    return {
      pageHtml: "",
      pageTitle,
      pageTitleSnippet,
      pageUrl,
    };
  }

  if (!chrome?.scripting?.executeScript) {
    throw new Error(
      "The Chrome scripting API is unavailable in this context. Reload the built extension and make sure the manifest includes the 'scripting' permission."
    );
  }

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: activeTab.id },
    func: () => {
      const documentHtml = document.documentElement?.outerHTML ?? "";
      return documentHtml.trim() ? `<!DOCTYPE html>\n${documentHtml}` : "";
    },
  });

  const pageHtml = typeof result === "string" ? result.trim() : "";

  if (!pageHtml) {
    throw new Error("No HTML was found on this page.");
  }

  return {
    pageHtml,
    pageTitle,
    pageTitleSnippet,
    pageUrl,
  };
}

export function formatPageHtmlError(error: unknown) {
  const fallbackMessage = "Unable to read the current page HTML.";
  const message = error instanceof Error ? error.message : fallbackMessage;

  if (message.includes("Cannot access contents of the page")) {
    return "This page could not be read. Reload the extension after rebuilding it, and note that Chrome blocks restricted pages like chrome://, the Chrome Web Store, and other extension pages.";
  }

  return message;
}

function extractFirstTwoWords(title: string) {
  return title.trim().match(/\S+(?:\s+\S+)?/)?.[0] ?? "";
}
