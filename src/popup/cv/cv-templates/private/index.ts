import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { CvData } from "@/constants/cvData";

type CvTemplateComponent = ForwardRefExoticComponent<
  {
    cv: CvData;
    previewZoom: number;
  } & RefAttributes<HTMLElement>
>;

type TemplateMetadata = {
  id: string;
  label: string;
  description: string;
};

export type CvTemplateDefinition = {
  id: string;
  label: string;
  description: string;
  component: CvTemplateComponent;
};

type TemplateModule = Record<string, unknown> & {
  templateMetadata?: TemplateMetadata;
};

function isTemplateComponent(value: unknown): value is CvTemplateComponent {
  return typeof value === "object" && value !== null && "$$typeof" in value;
}

// Dynamically import all CVTemplate*.tsx files
const templateModules = import.meta.glob<TemplateModule>("./**CVTemplate*.tsx", {
  eager: true,
});

// Build templates array dynamically from all template files
export const privateTemplates: CvTemplateDefinition[] = Object.entries(
  templateModules,
)
  .map(([path, module]) => {
    const component = Object.entries(module).find(
      ([exportName, value]) =>
        exportName !== "templateMetadata" && isTemplateComponent(value),
    )?.[1] as CvTemplateComponent | undefined;

    const metadata = module.templateMetadata;

    if (!component || !metadata) {
      console.warn(`Skipping ${path}: missing component or templateMetadata`);
      return null;
    }

    return {
      id: metadata.id,
      label: metadata.label,
      description: metadata.description,
      component,
    };
  })
  .filter((template): template is CvTemplateDefinition => template !== null)
  .sort((a, b) => a.id.localeCompare(b.id));
