export type CvContactItem = {
  label?: string;
  value: string;
  href?: string;
};

export type CvEntry = {
  dateRange: string;
  title: string;
  organization: string;
  link?: string;
  location: string;
  bullets: string[];
  stack?: string[];
};

export type CvSection = {
  title: string;
  entries: CvEntry[];
};

export type CvData = {
  name: string;
  role: string;
  contactLines: CvContactItem[][];
  profile: {
    label: string;
    summary: string;
  };
  skillGroups: Array<{
    label: string;
    items: string[];
  }>;
  sections: CvSection[];
};
