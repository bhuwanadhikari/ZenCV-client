import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { CvData } from "@/constants/cvData";
import { CVTemplate1 } from "./CVTemplate1";
import { CVTemplate2 } from "./CVTemplate2";
import { CVTemplate3 } from "./CVTemplate3";
import { CVTemplate4 } from "./CVTemplate4";
import { CVTemplate5 } from "./CVTemplate5";
import { CVTemplate6 } from "./CVTemplate6";

export type CvTemplateId =
  | "template-1"
  | "template-2"
  | "template-3"
  | "template-4"
  | "template-5"
  | "template-6";

type CvTemplateComponent = ForwardRefExoticComponent<
  {
    cv: CvData;
    previewZoom: number;
  } & RefAttributes<HTMLElement>
>;

export const cvTemplates: Array<{
  id: CvTemplateId;
  label: string;
  description: string;
  component: CvTemplateComponent;
}> = [
  {
    id: "template-2",
    label: "Balancer",
    description: "Balanced header with supporting sidebar",
    component: CVTemplate2,
  },
  {
    id: "template-3",
    label: "Timeliner",
    description: "Strong left rail with a clean timeline body",
    component: CVTemplate3,
  },
  {
    id: "template-4",
    label: "Minimaler",
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
    label: "Modernist",
    description: "Bold profile cards and modular experience blocks",
    component: CVTemplate6,
  },
];
