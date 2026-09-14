// All site copy. URLs live in links.js.

import { links } from "./links.js";

// ── PROFILE ──────────────────────────────────────────────────────────────────
export const profile = {
  name: "Aaditya Gupta",
  handle: "aaditya",
  // Panel title bar prompt: aaditya@portfolio: ~/about
  host: "portfolio",
  role: "Aspiring Data Scientist · AI/ML",
  location: "Vellore, India",

  email: links.email,
  github: links.github,
  linkedin: links.linkedin,
  driveFolder: links.driveFolder,

  portrait: "img/portrait.jpg",
};

// ── GREETING ─────────────────────────────────────────────────────────────────
export const bootMessage =
  "Hi, I'm Aaditya Gupta — an aspiring Data Scientist with a growing focus on " +
  "AI and Machine Learning. Have a look around.";

// ── ABOUT ────────────────────────────────────────────────────────────────────
export const about = {
  title: "~/about",
  paragraphs: [
    "I'm an aspiring Data Scientist with a keen and growing interest in AI and Machine Learning. I'm currently in my B.Tech in Computer Science at VIT Vellore, and most of what I build starts with a dataset and a question I can't answer yet.",
    "I like the whole path from raw data to something a person can act on — cleaning it, modelling it, and then making the result legible. That's as true of a spectral classification tool as it is of a Power BI dashboard a factory team actually opens in the morning.",
    "Right now I'm going deeper into machine learning and generative AI, and into what it takes to make a model useful outside a notebook. I'm always open to collaborating on an interesting problem.",
  ],
  stats: [
    { label: "focus", value: "data science · AI/ML" },
    { label: "studying", value: "B.Tech CSE, VIT Vellore (CGPA 8.79)" },
    { label: "spoken", value: "English · Hindi · Japanese (basic)" },
    { label: "status", value: "open to collaboration" },
  ],
};

// ── EDUCATION ────────────────────────────────────────────────────────────────
export const education = [
  {
    school: "Vellore Institute of Technology",
    place: "Vellore, TN",
    period: "Aug 2023 – July 2027",
    detail: "B.Tech in Computer Science and Engineering · CGPA 8.79",
  },
  {
    school: "DAV Public School, Sector 14",
    place: "Gurugram, HR",
    period: "2021 – 2023",
    detail: "Class XII: 93.6% · Class X: 94.8%",
  },
];

// ── EXPERIENCE ───────────────────────────────────────────────────────────────
export const experience = [
  {
    org: "Nestlé India",
    role: "Data Analyst Intern",
    place: "Bangalore, KA",
    period: "May 2026 – July 2026",
    bullets: [
      "Engineered end-to-end data pipelines and interactive Power BI dashboards using Python, SQL and Excel to track factory digitisation KPIs and operational metrics across the AOA region.",
      "Validated and integrated manufacturing execution system (MES) data across SAP/ERP workflows, while assisting in enterprise SQL Server migration and database optimisation.",
    ],
  },
];

// ── PROJECTS ─────────────────────────────────────────────────────────────────
export const projects = [
  {
    id: "01",
    name: "Spectral Matching Tool",
    tagline: "Hyperspectral image classification against the USGS library.",
    detail:
      "A GUI application that processes hyperspectral imagery and benchmarks it against the USGS Spectral Library. Implements the Tetracorder framework with continuum removal and shape matching to spatially segment images and classify regions by their best-matched spectral signature.",
    stack: ["Python", "Tkinter", "NumPy", "Matplotlib", "SQLite"],
    status: "research tool",
    href: links.github,
  },
  {
    id: "02",
    name: "GeoIntel",
    tagline: "Geopolitical network intelligence over 696K+ global events.",
    detail:
      "An NLP pipeline using DistilBERT to classify more than 696,000 global geopolitical events across 218 countries into diplomatic, economic and conflict categories. Builds weighted country-interaction graphs with NetworkX and serves a Streamlit dashboard for network centrality, bloc detection and temporal trends.",
    stack: ["Python", "DistilBERT", "NetworkX", "Streamlit", "Plotly", "GDELT"],
    status: "active",
    href: links.github,
  },
  {
    id: "03",
    name: "Air Quality Index Prediction",
    tagline: "Forecasting pollution across major Indian cities.",
    detail:
      "A forecasting framework comparing classical and deep learning approaches — ARIMA, Random Forest, XGBoost and LSTM — to predict AQI across major Indian cities, with evaluation and visualisation of model accuracy and pollution trends. Written up as a research paper.",
    stack: ["Python", "ARIMA", "Random Forest", "XGBoost", "LSTM"],
    status: "research paper",
    href: links.github,
  },
  {
    id: "04",
    name: "LearnHub",
    tagline: "Cloud-native learning platform.",
    detail:
      "A scalable learning platform supporting course management, live classes, assessments and student progress tracking, prepared for AWS deployment across EC2, S3 and CloudFront.",
    stack: ["AWS", "JavaScript", "DevOps"],
    status: "active",
    href: links.github,
  },
];

// ── SKILLS ───────────────────────────────────────────────────────────────────
export const skills = [
  {
    group: "languages",
    items: ["Python", "Java", "SQL", "C/C++", "JavaScript", "HTML", "CSS"],
  },
  {
    group: "data & ML",
    items: [
      "NumPy",
      "Pandas",
      "TensorFlow",
      "NLTK",
      "Matplotlib",
      "Plotly",
      "XGBoost",
    ],
  },
  {
    group: "analytics",
    items: ["Power BI", "Tableau", "MS Excel", "MySQL"],
  },
  {
    group: "tools",
    items: ["Git", "GitHub", "Docker", "Tkinter", "PySide"],
  },
  {
    group: "platforms",
    items: ["AWS", "Google Cloud Platform", "Linux", "Windows"],
  },
  {
    group: "spoken",
    items: ["English (fluent)", "Hindi (fluent)", "Japanese (basic)"],
  },
];

// ── EXTRAS ───────────────────────────────────────────────────────────────────
export const certifications = [
  {
    name: "IBM Advanced Generative AI",
    detail:
      "Hands-on work with generative AI architectures, large language models, prompt engineering and model fine-tuning.",
  },
];

export const leadership = [
  {
    org: "Williams Matriculation Higher Secondary School",
    role: "Volunteer Instructor · Letter of Appreciation",
    period: "June 2025",
    detail:
      "Ran an interactive session on fundamental computer science concepts for high school students, translating technical topics into hands-on learning.",
  },
];

// ── CONTACT ──────────────────────────────────────────────────────────────────
export const contact = {
  blurb:
    "Open to collaboration — happy to talk about any project involving messy data and a real question.",
  channels: [
    { label: "email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "github", value: "aadityagupta30105", href: profile.github },
    { label: "linkedin", value: "Aaditya Gupta", href: profile.linkedin },
    {
      label: "documents",
      value: "resume & certificates (Drive)",
      href: profile.driveFolder,
    },
  ],
};

// ── CREDITS ──────────────────────────────────────────────────────────────────
// Tileset licence asks for a credit (public/tiles/LICENSE.txt).
export const credits = {
  art: "Pixel art: Modern Interiors by LimeZu (free version — non-commercial use).",
};
