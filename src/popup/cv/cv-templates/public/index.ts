import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { CvData } from "@/constants/cvData";
import { CVTemplate2 } from "./CVTemplate2";
import { CVTemplate3 } from "./CVTemplate3";
import { CVTemplate4 } from "./CVTemplate4";
import { CVTemplate5 } from "./CVTemplate5";
import { CVTemplate6 } from "./CVTemplate6";
import { CVTemplate8 } from "./CVTemplate8";
import { CVTemplate9 } from "./CVTemplate9";

type CvTemplateComponent = ForwardRefExoticComponent<
  {
    cv: CvData;
    previewZoom: number;
  } & RefAttributes<HTMLElement>
>;

export type CvTemplateDefinition = {
  id: string;
  label: string;
  description: string;
  component: CvTemplateComponent;
};

export const publicTemplates: CvTemplateDefinition[] = [
  {
    id: "template-8",
    label: "Lean",
    description:
      "Left-aligned resume without skills and with stacked entry dates",
    component: CVTemplate8,
  },
  {
    id: "template-2",
    label: "Balanced",
    description: "Balanced header with supporting sidebar",
    component: CVTemplate2,
  },
  {
    id: "template-3",
    label: "Timeline",
    description: "Strong left rail with a clean timeline body",
    component: CVTemplate3,
  },
  {
    id: "template-columned",
    label: "Columned",
    description: "Two-column layout with clean stacked entries",
    component: CVTemplate9,
  },
  {
    id: "template-4",
    label: "Minimal",
    description: "Quiet editorial layout with a compact sidebar",
    component: CVTemplate4,
  },
  {
    id: "template-5",
    label: "Editorial",
    description: "Magazine-inspired sections with chip-style skills",
    component: CVTemplate5,
  },
  {
    id: "template-6",
    label: "Modern",
    description: "Bold profile cards and modular experience blocks",
    component: CVTemplate6,
  },
] as const;
