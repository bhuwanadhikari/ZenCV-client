import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { CvData } from "@/constants/cvData";
import { publicTemplates } from "./public";
import type { CvTemplateDefinition as PrivateCvTemplateDefinition } from "./private";

export type CvTemplateId =
  | "template-1"
  | "template-2"
  | "template-3"
  | "template-columned"
  | "template-4"
  | "template-5"
  | "template-6"
  | "template-7"
  | "template-8";

type CvTemplateComponent = ForwardRefExoticComponent<
  {
    cv: CvData;
    previewZoom: number;
  } & RefAttributes<HTMLElement>
>;

export type CvTemplateDefinition = {
  id: CvTemplateId;
  label: string;
  description: string;
  component: CvTemplateComponent;
};

const privateTemplateFiles = import.meta.glob("./private/*.tsx");

export async function loadCvTemplates(): Promise<CvTemplateDefinition[]> {
  if (Object.keys(privateTemplateFiles).length === 0) {
    return publicTemplates as CvTemplateDefinition[];
  }

  const privateTemplates: PrivateCvTemplateDefinition[] =
    (await import("./private")).privateTemplates;

  return [...privateTemplates, ...publicTemplates] as CvTemplateDefinition[];
}

export const cvTemplates = publicTemplates as CvTemplateDefinition[];

// Export for convenience
export { publicTemplates } from "./public";
