import type {
  CvContactItem,
  CvData,
  CvEntry,
  CvSection,
} from "@/constants/cvData";
import {
  clearStoredAuthSession,
  getStoredAuthTokenAsync,
} from "@/lib/auth-storage";
import { normalizePageTitle } from "@/lib/page-title";

const DEFAULT_API_BASE_URL = "http://localhost:8000";
const DEFAULT_AI_MODEL_NAME = "gpt-4.1-mini";

export const API_BASE_URL = normalizeApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL,
);
export const AI_MODEL_NAME = normalizeAiModelName(
  import.meta.env.VITE_AI_MODEL_NAME,
);

export type ProcessedJobDescriptionResult = {
  jobDescription: string;
  pageTitle: string;
  pageUrl: string;
  status: number;
  url: string;
};

type ProcessedJobDescriptionResponse = {
  processed_html: string;
  processed_text: string;
};

export type GeneratedCvResult = {
  cv: CvData;
  status: number;
  url: string;
};

export type GeneratedCoverLetterResult = {
  coverLetter: string;
  status: number;
  url: string;
};

function normalizeApiBaseUrl(value?: string) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return DEFAULT_API_BASE_URL;
  }

  return trimmedValue.replace(/\/+$/, "");
}

function normalizeAiModelName(value?: string) {
  const trimmedValue = value?.trim();
  return trimmedValue || DEFAULT_AI_MODEL_NAME;
}

async function getAuthenticatedJsonHeaders() {
  const token = await getStoredAuthTokenAsync();

  if (!token) {
    throw new Error(
      "You are not signed in. Open Settings and sign in with Google to continue.",
    );
  }

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function throwIfUnauthorized(status: number) {
  if (status !== 401) {
    return;
  }

  clearStoredAuthSession();
  throw new Error("Your session has expired. Please sign in again.");
}

type ProcessJobDescriptionParams = {
  pageHtml: string;
  job_url?: string;
  page_title?: string;
};

export async function getProcessedJobDescription({
  pageHtml,
  job_url,
  page_title,
}: ProcessJobDescriptionParams) {
  const headers = await getAuthenticatedJsonHeaders();
  const response = await fetch(`${API_BASE_URL}/api/job-description/process`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      raw_html: pageHtml,
      job_url,
    }),
  });
  const rawBody = await response.text();
  const parsedBody = parseJsonResponse(
    rawBody,
    "Job description",
  ) as ProcessedJobDescriptionResponse | null;

  if (!response.ok) {
    throwIfUnauthorized(response.status);

    throw new Error(
      getErrorMessage(parsedBody) ||
        `Job description processing failed with status ${response.status}.`,
    );
  }

  if (!parsedBody?.processed_text) {
    throw new Error("Job description response format is not recognized.");
  }

  return {
    jobDescription: parsedBody.processed_text,
    pageTitle: normalizePageTitle(page_title),
    pageUrl: job_url ?? "",
    status: response.status,
    url: `${API_BASE_URL}/api/job-description/process`,
  } satisfies ProcessedJobDescriptionResult;
}

type GenerateCvParams = {
  jobDescription: string;
  job_url?: string;
  page_title?: string;
  storyJsonOverride: Record<string, unknown>;
};

export async function getGeneratedCv({
  jobDescription,
  job_url,
  page_title,
  storyJsonOverride,
}: GenerateCvParams) {
  const headers = await getAuthenticatedJsonHeaders();
  const response = await fetch(`${API_BASE_URL}/api/cv/generate`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      job_description: jobDescription,
      job_url: job_url,
      page_title: page_title,
      model_name: AI_MODEL_NAME,
      story_json_override: storyJsonOverride,
    }),
  });
  const rawBody = await response.text();
  const parsedBody = parseJsonResponse(rawBody, "CV");

  if (!response.ok) {
    throwIfUnauthorized(response.status);

    throw new Error(
      getErrorMessage(parsedBody) ||
        `CV generation failed with status ${response.status}.`,
    );
  }

  return {
    cv: mapGeneratedCvResponse(parsedBody),
    status: response.status,
    url: `${API_BASE_URL}/api/cv/generate`,
  } satisfies GeneratedCvResult;
}

type GenerateCoverLetterParams = {
  jobDescription: string;
  job_url?: string;
  page_title?: string;
};

export async function getGeneratedCoverLetter({
  jobDescription,
  job_url,
  page_title,
}: GenerateCoverLetterParams) {
  const headers = await getAuthenticatedJsonHeaders();
  const response = await fetch(`${API_BASE_URL}/api/cover-letter/generate`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      job_description: jobDescription,
      job_url,
      page_title,
    }),
  });
  const rawBody = await response.text();
  const parsedBody = parseJsonResponse(rawBody, "Cover letter");

  if (!response.ok) {
    throwIfUnauthorized(response.status);

    throw new Error(
      getErrorMessage(parsedBody) ||
        `Cover letter generation failed with status ${response.status}.`,
    );
  }

  return {
    coverLetter: mapGeneratedCoverLetterResponse(parsedBody),
    status: response.status,
    url: `${API_BASE_URL}/api/cover-letter/generate`,
  } satisfies GeneratedCoverLetterResult;
}

function mapGeneratedCvResponse(payload: unknown): CvData {
  const root = unwrapPayload(payload);

  if (!hasRecognizableCvFields(root)) {
    throw new Error("CV response format is not recognized.");
  }

  return {
    name: getFirstString(root, ["name", "fullName"]) ?? "",
    role: getFirstString(root, ["role", "title", "headline", "position"]) ?? "",
    contactLines: mapContactLines(root),
    profile: mapProfile(root),
    skillGroups: mapSkillGroups(root),
    sections: mapSections(root),
  };
}

function unwrapPayload(payload: unknown) {
  const record = asRecord(payload);

  if (!record) {
    return null;
  }

  for (const key of ["cv", "data", "result", "resume"]) {
    const nested = asRecord(record[key]);

    if (nested) {
      return nested;
    }
  }

  return record;
}

function mapGeneratedCoverLetterResponse(payload: unknown) {
  const root = unwrapPayload(payload);

  if (!root) {
    throw new Error("Cover letter response format is not recognized.");
  }

  const coverLetter = getFirstString(root, [
    "cover_letter",
    "coverLetter",
    "text",
  ]);

  if (!coverLetter) {
    throw new Error("Cover letter response format is not recognized.");
  }

  return coverLetter;
}

function hasRecognizableCvFields(
  value: Record<string, unknown> | null,
): value is Record<string, unknown> {
  if (!value) {
    return false;
  }

  return [
    "name",
    "fullName",
    "role",
    "title",
    "headline",
    "profile",
    "summary",
    "skills",
    "skillGroups",
    "sections",
    "experience",
    "education",
  ].some((key) => key in value);
}

function mapContactLines(root: Record<string, unknown>) {
  const contactLines = root.contactLines;

  if (Array.isArray(contactLines)) {
    const normalized = contactLines
      .map((line) => {
        if (Array.isArray(line)) {
          return line.filter(isPresent).map(mapContactItem).filter(isPresent);
        }

        const item = mapContactItem(line);
        return item ? [item] : [];
      })
      .filter((line) => line.length > 0);

    if (normalized.length > 0) {
      return normalized;
    }
  }

  const contacts = asRecord(root.contacts) ?? root;
  const location = getFirstString(contacts, ["location", "city"]);
  const phone = getFirstString(contacts, ["phone", "telephone", "mobile"]);
  const email = getFirstString(contacts, ["email"]);
  const github = getFirstString(contacts, ["github"]);
  const linkedin = getFirstString(contacts, ["linkedin"]);
  const website = getFirstString(contacts, ["website", "portfolio"]);
  const primaryLine = [
    makeContactItem(location),
    makeContactItem(phone),
    makeContactItem(email, undefined, buildMailtoHref(email)),
  ].filter(isPresent);
  const secondaryLine = [
    makeContactItem(github, "Github", buildExternalHref(github)),
    makeContactItem(linkedin, "Linkedin", buildExternalHref(linkedin)),
    makeContactItem(website, "Website", buildExternalHref(website)),
  ].filter(isPresent);

  return [primaryLine, secondaryLine].filter((line) => line.length > 0);
}

function mapProfile(root: Record<string, unknown>) {
  const profile = root.profile;
  const profileRecord = asRecord(profile);

  if (profileRecord) {
    return {
      label: getFirstString(profileRecord, ["label", "title"]) ?? "Profile",
      summary:
        getFirstString(profileRecord, ["summary", "text", "content"]) ?? "",
    };
  }

  return {
    label: "Profile",
    summary:
      getFirstString(root, [
        "summary",
        "profileSummary",
        "about",
        "objective",
      ]) ?? "",
  };
}

function mapSkillGroups(root: Record<string, unknown>) {
  const skillGroups = root.skillGroups;

  if (Array.isArray(skillGroups)) {
    const normalized = skillGroups
      .map((group, index) => {
        const record = asRecord(group);

        if (!record) {
          const items = toStringArray(group);
          return items.length > 0
            ? { label: `Skills ${index + 1}`, items }
            : null;
        }

        const items = toStringArray(
          record.items ?? record.skills ?? record.values,
        );

        if (items.length === 0) {
          return null;
        }

        return {
          label: getFirstString(record, ["label", "title", "name"]) ?? "Skills",
          items,
        };
      })
      .filter(isPresent);

    if (normalized.length > 0) {
      return normalized;
    }
  }

  const skills = root.skills;

  if (Array.isArray(skills)) {
    const items = toStringArray(skills);
    return items.length > 0 ? [{ label: "Skills", items }] : [];
  }

  const skillRecord = asRecord(skills);

  if (skillRecord) {
    return Object.entries(skillRecord)
      .map(([label, value]) => {
        const items = toStringArray(value);
        return items.length > 0 ? { label: toTitleCase(label), items } : null;
      })
      .filter(isPresent);
  }

  return [];
}

function mapSections(root: Record<string, unknown>) {
  const sections = root.sections;

  if (Array.isArray(sections)) {
    const normalized = sections.map(mapSection).filter(isPresent);

    if (normalized.length > 0) {
      return normalized;
    }
  }

  const fallbackSections = [
    buildSectionFromCollection(root.experience, "Professional Experience"),
    buildSectionFromCollection(root.education, "Education"),
    buildSectionFromCollection(root.projects, "Projects"),
    buildSectionFromCollection(root.certifications, "Certifications"),
  ].filter(isPresent);

  return fallbackSections;
}

function mapSection(value: unknown) {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const collection = record.entries ?? record.items;
  const entries = Array.isArray(collection)
    ? collection.map(mapEntry).filter(isPresent)
    : [];

  if (entries.length === 0) {
    return null;
  }

  return {
    title: getFirstString(record, ["title", "label", "name"]) ?? "Section",
    entries,
  } satisfies CvSection;
}

function buildSectionFromCollection(value: unknown, title: string) {
  if (!Array.isArray(value)) {
    return null;
  }

  const entries = value.map(mapEntry).filter(isPresent);

  return entries.length > 0 ? { title, entries } : null;
}

function mapEntry(value: unknown) {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const organizationRecord = asRecord(record.organization);
  const resourceRecord = asRecord(record.resource);
  const bullets = toStringArray(
    record.bullets ??
      record.highlights ??
      record.responsibilities ??
      record.achievements ??
      record.descriptions,
  );
  const stack = toStringArray(
    record.stack ?? record.technologies ?? record.techStack ?? record.skills,
  );
  const organizationName =
    (organizationRecord &&
      getFirstString(organizationRecord, ["name", "title", "label"])) ??
    getFirstString(record, ["organization", "company", "institution", "school"]) ??
    "";
  const organizationUrl = buildExternalHref(
    (organizationRecord &&
      getFirstString(organizationRecord, ["url", "href", "link", "website"])) ??
      getFirstString(record, [
        "link",
        "href",
        "url",
        "organizationLink",
        "companyLink",
        "institutionLink",
        "website",
      ]),
  );
  const organizationAddress =
    (organizationRecord &&
      getFirstString(organizationRecord, ["address", "location", "place"])) ??
    getFirstString(record, ["location", "place"]) ??
    "";
  const resourcePlaceholder = resourceRecord
    ? getFirstString(resourceRecord, ["placeholder", "label", "title", "name"])
    : undefined;
  const resourceUrl = buildExternalHref(
    resourceRecord
      ? getFirstString(resourceRecord, ["url", "href", "link", "website"])
      : undefined,
  );

  return {
    dateRange: getFirstString(record, ["dateRange", "dates", "duration"]) ?? "",
    title:
      getFirstString(record, ["title", "role", "position", "degree", "name"]) ??
      "",
    organization: {
      name: organizationName,
      url: organizationUrl,
      address: organizationAddress,
    },
    resource: resourcePlaceholder
      ? {
          placeholder: resourcePlaceholder,
          url: resourceUrl,
        }
      : undefined,
    bullets,
    stack: stack.length > 0 ? stack : undefined,
  } satisfies CvEntry;
}

function mapContactItem(value: unknown) {
  if (typeof value === "string") {
    return { value };
  }

  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const contactValue =
    getFirstString(record, ["value", "text", "name", "url"]) ?? "";

  if (!contactValue) {
    return null;
  }

  return {
    label: getFirstString(record, ["label", "title"]),
    value: contactValue,
    href: getFirstString(record, ["href", "url", "link"]),
  } satisfies CvContactItem;
}

function makeContactItem(value?: string, label?: string, href?: string) {
  if (!value) {
    return null;
  }

  return {
    label,
    value,
    href,
  } satisfies CvContactItem;
}

function buildMailtoHref(email?: string) {
  return email ? `mailto:${email}` : undefined;
}

function buildExternalHref(value?: string) {
  if (!value) {
    return undefined;
  }

  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}

function getFirstString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = toStringValue(record[key]);

    if (value) {
      return value;
    }
  }

  return undefined;
}

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(toStringValue)
    .filter((item): item is string => Boolean(item));
}

function parseJsonResponse(rawBody: string, resourceLabel: string) {
  if (!rawBody.trim()) {
    return null;
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    throw new Error(
      `${resourceLabel} generation API did not return valid JSON.`,
    );
  }
}

function getErrorMessage(value: unknown) {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  return getFirstString(record, ["message", "error", "detail"]);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function toStringValue(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return undefined;
}

function isPresent<T>(value: T | null | undefined): value is T {
  return value != null;
}

function toTitleCase(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}
