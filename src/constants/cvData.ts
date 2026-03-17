export type CvContactItem = {
  label?: string;
  value: string;
  href?: string;
};

export type CvEntry = {
  dateRange: string;
  title: string;
  organization: string;
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

export const cvData: CvData = {
  name: "BHUWAN ADHIKARI",
  role: "SOFTWARE DEVELOPER",
  contactLines: [
    [
      { value: "Trier, Germany" },
      { value: "+4917676330765" },
      {
        value: "bhuwanadhikari7788@gmail.com",
        href: "mailto:bhuwanadhikari7788@gmail.com",
      },
    ],
    [
      {
        label: "Github",
        value: "github.com/bhuwanadhikari",
        href: "https://github.com/bhuwanadhikari",
      },
      {
        label: "Linkedin",
        value: "linkedin.com/in/bhuwanadhikari",
        href: "https://linkedin.com/in/bhuwanadhikari",
      },
    ],
  ],
  profile: {
    label: "Profile",
    summary:
      "Full stack developer with 4 years' experience in full stack development; now pursuing MSc. in NLP to specialize in AI and Linguistics, while continuously learning and evolving for the future.",
  },
  skillGroups: [
    {
      label: "Frontend",
      items: [
        "React.js",
        "Next.js",
        "Redux",
        "Jest",
        "React Testing Library",
        "Vite",
        "React Native",
        "Expo",
      ],
    },
    {
      label: "Backend",
      items: [
        "Node.js",
        "Typescript",
        "Express.js",
        "PostgreSQL",
        "MongoDB",
        "REST API",
        "Docker",
      ],
    },
  ],
  sections: [
    {
      title: "Professional Experience",
      entries: [
        {
          dateRange: "Mar 2022 - Feb 2025",
          title: "Software Developer",
          organization: "Lasting Dynamics",
          location: "Las Palmas, Spain (Remote)",
          stack: [
            "React.js",
            "Node.js",
            "Express.js",
            "Typescript",
            "PostgreSQL",
            "React Native",
            "Agile",
            "SCRUM",
          ],
          bullets: [
            "Designed and developed enterprise-level web and cross-platform mobile applications using React Native, React.js, Redux, Typescript, and Next.js.",
            "Implemented room-based real-time communication using Socket.io, enabling targeted event broadcasting to specific users and groups.",
            "Implemented user authentication and role-based authorization using JWT and OAuth2, securing endpoints for 5K+ registered users.",
            "Added API documentation with Swagger and aligned endpoints with frontend needs to reduce integration back-and-forth.",
            "Built a background PDF generation and email delivery system using Node.js, PostgreSQL, Redis (BullMQ), and AWS SES.",
            "Guided and mentored 4 junior developers through code reviews and pair programming, improving code quality and accelerating later sprint bug fixes by 1.5x.",
          ],
        },
        {
          dateRange: "May 2021 - Feb 2022",
          title: "Software Developer",
          organization: "Khalti",
          location: "Lalitpur, Nepal",
          stack: [
            "React.js",
            "Next.js",
            "Node.js",
            "Typescript",
            "Postgresql",
            "Docker",
            "Git",
            "Jira",
          ],
          bullets: [
            "Designed, developed, and maintained backend RESTful APIs with Express.js/Nest.js and frontend components with React.js and Next.js for a payment gateway used by 1M+ users.",
            "Implemented modular components with efficient performance using memoization, lazy loading, and code splitting.",
            "Developed automated data migration scripts, successfully transferring 500K+ records from a legacy system with zero data loss.",
          ],
        },
      ],
    },
    {
      title: "Education",
      entries: [
        {
          dateRange: "Oct 2025 - Present",
          title: "MSc. in Natural Language Processing",
          organization: "Universitat Trier",
          location: "Trier, Germany",
          bullets: [
            "Researching and learning code-generation principles in NLP at the intersection of AI and software engineering, while building projects with Hugging Face Transformers, spaCy, Pytorch, and NLTK.",
          ],
        },
        {
          dateRange: "Nov 2016 - May 2021",
          title: "Bachelors Degree in Computer Engineering",
          organization: "Tribhuvan University",
          location: "Kathmandu, Nepal",
          bullets: [
            "Participated in hackathons building projects in robotics, AI, and microcontroller programming.",
            "Built a blockchain-based medicine supply chain system using a private blockchain network as a final year project, demonstrating distributed systems and applied cryptography.",
          ],
        },
      ],
    },
  ],
};
