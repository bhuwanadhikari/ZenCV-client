import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { CvData } from "@/constants/cvData";
import { CVTemplate2 } from "./CVTemplate2";
import { CVTemplate3 } from "./CVTemplate3";
import { CVTemplate4 } from "./CVTemplate4";
import { CVTemplate5 } from "./CVTemplate5";
import { CVTemplate6 } from "./CVTemplate6";
import { CVTemplate8 } from "./CVTemplate8";

export type CvTemplateId =
  | "template-1"
  | "template-2"
  | "template-3"
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

type CvTemplateDefinition = {
  id: CvTemplateId;
  label: string;
  description: string;
  component: CvTemplateComponent;
};

type Template1Module = {
  CVTemplate1?: CvTemplateComponent;
};

type Template7Module = {
  CVTemplate7?: CvTemplateComponent;
};

function getOptionalTemplate1(): CvTemplateDefinition | null {
  try {
    const modules = import.meta.glob<Template1Module>("./CVTemplate1.tsx", {
      eager: true,
    });
    const template1 = modules["./CVTemplate1.tsx"]?.CVTemplate1;

    if (!template1) {
      return null;
    }

    return {
      id: "template-1",
      label: "Classic",
      description: "Centered, traditional one-column resume",
      component: template1,
    };
  } catch {
    return null;
  }
}

const optionalTemplate1 = getOptionalTemplate1();

function getOptionalTemplate7(): CvTemplateDefinition | null {
  try {
    const modules = import.meta.glob<Template7Module>("./CVTemplate7.tsx", {
      eager: true,
    });
    const template7 = modules["./CVTemplate7.tsx"]?.CVTemplate7;

    if (!template7) {
      return null;
    }

    return {
      id: "template-7",
      label: "Simple Left",
      description:
        "Classic one-column resume with a cleaner left-aligned header",
      component: template7,
    };
  } catch {
    return null;
  }
}

const optionalTemplate7 = getOptionalTemplate7();

export const cvTemplates: CvTemplateDefinition[] = [
  ...(optionalTemplate1 ? [optionalTemplate1] : []),
  {
    id: "template-8",
    label: "Lean Left",
    description:
      "Left-aligned resume without skills and with stacked entry dates",
    component: CVTemplate8,
  },
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
  ...(optionalTemplate7 ? [optionalTemplate7] : []),
];
