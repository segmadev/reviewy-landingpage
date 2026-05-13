/**
 * Client-side CV / text extraction utility.
 * Parses any free-form text (pasted CV, LinkedIn profile, job description, etc.)
 * and returns structured fields that can be used to auto-fill the builder.
 */

export interface ExtractionResult {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  linkedinUrl?: string;
  portfolioUrls?: string[];
  skills?: string[];
  summary?: string;
}

// ─── Skills database ────────────────────────────────────────────────────────
const SKILLS_DB: string[] = [
  // Frontend
  'JavaScript','TypeScript','React','Vue.js','Angular','Next.js','Nuxt.js',
  'Svelte','Gatsby','HTML','CSS','Sass','Tailwind CSS','Bootstrap','jQuery',
  'Redux','Zustand','GraphQL','REST API','WebSockets','Webpack','Vite',
  // Backend
  'Node.js','Express.js','Django','Flask','FastAPI','Spring Boot','Laravel',
  'Ruby on Rails','ASP.NET','Go','PHP','Java','C#','Python','Ruby','Kotlin',
  'Scala','Rust','C++','Swift','Dart','Elixir',
  // Mobile
  'React Native','Flutter','iOS Development','Android Development',
  // Databases
  'PostgreSQL','MySQL','MongoDB','Redis','SQLite','Oracle','Elasticsearch',
  'Firebase','Supabase','DynamoDB','Cassandra','MariaDB','SQL Server',
  // Cloud & DevOps
  'AWS','Azure','GCP','Docker','Kubernetes','Terraform','Ansible','Jenkins',
  'GitHub Actions','CI/CD','Linux','Bash','Nginx','Apache','Serverless',
  // Data & AI
  'Machine Learning','Deep Learning','TensorFlow','PyTorch','scikit-learn',
  'Data Science','NLP','Computer Vision','Pandas','NumPy','R','MATLAB',
  'Tableau','Power BI','Data Analysis','Data Engineering','Spark','Hadoop',
  'Looker','dbt','Airflow','BigQuery','Snowflake',
  // Design
  'Figma','Adobe Photoshop','Adobe Illustrator','Adobe XD','Sketch','InVision',
  'Canva','UX Design','UI Design','User Research','Wireframing','Prototyping',
  'Design Systems','Branding','Typography','Motion Design','After Effects',
  // Marketing
  'SEO','SEM','Google Ads','Facebook Ads','Social Media Marketing',
  'Content Marketing','Email Marketing','HubSpot','Salesforce','Marketo',
  'Google Analytics','A/B Testing','Copywriting','Public Relations',
  'Brand Management','Influencer Marketing','TikTok','Instagram','LinkedIn Ads',
  'MailChimp','ActiveCampaign','Klaviyo','SEMrush','Ahrefs','Hootsuite',
  // Business / PM
  'Project Management','Product Management','Agile','Scrum','Kanban','JIRA',
  'Confluence','Strategic Planning','Business Development','Market Research',
  'Stakeholder Management','Change Management','Process Improvement',
  'Operations Management','Lean','Six Sigma','OKRs','KPIs',
  // Finance / Accounting
  'Financial Analysis','Financial Modelling','Budgeting','Forecasting',
  'Valuation','Due Diligence','P&L Management','Accounting','Auditing',
  'Tax Compliance','QuickBooks','SAP','Bloomberg','Excel','PowerPoint',
  // Soft skills
  'Leadership','Communication','Problem Solving','Team Management','Mentoring',
  'Presentation','Negotiation','Critical Thinking','Collaboration','Adaptability',
  // Additional tech
  'Salesforce','Dynamics 365','NetSuite','Workday','Oracle ERP',
  'Adobe Creative Suite','Microsoft Office','Google Workspace','Notion',
  'Slack','Zendesk','Intercom',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractEmail(text: string): string | undefined {
  const m = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return m?.[0];
}

function extractPhone(text: string): string | undefined {
  // Match common international and local phone formats
  const patterns = [
    /\+?\d[\d\s\-().]{6,18}\d/g,
  ];
  for (const re of patterns) {
    const matches = text.match(re) ?? [];
    for (const raw of matches) {
      const digits = raw.replace(/\D/g, '');
      if (digits.length >= 7 && digits.length <= 15) {
        return raw.trim();
      }
    }
  }
  return undefined;
}

function extractLinkedIn(text: string): string | undefined {
  const m = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([\w\-]+)\/?/i);
  if (!m) return undefined;
  return `https://linkedin.com/in/${m[1]}`;
}

function extractPortfolio(text: string): string[] {
  const blocked = /linkedin\.com|indeed\.com|glassdoor\.com|monster\.com|reed\.co|totaljobs|jobsite\.co/i;
  const urls = text.match(/https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/gi) ?? [];
  return [...new Set(urls.filter(u => !blocked.test(u)))].slice(0, 2);
}

function extractName(text: string): string | undefined {
  // Strategy: find the first line that looks like a human name
  // — 2–4 words, all title-cased, no digits, not a heading keyword
  const STOP = /^(dear|to|from|re:|ref:|subject:|date:|job|position|role|apply|about|summary|profile|objective|experience|education|skills|contact|references|certif|award)/i;
  const lines = text.split(/\n+/).map(l => l.trim()).filter(l => l.length > 2);

  for (const line of lines.slice(0, 10)) {
    if (line.length > 60) continue;
    if (/[@\d/\\|<>{}]/.test(line)) continue;
    if (STOP.test(line)) continue;
    if (/[:•\-–—]/.test(line)) continue;
    const words = line.split(/\s+/);
    if (words.length < 2 || words.length > 4) continue;
    const allTitle = words.every(w => /^[A-ZÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÑ]/.test(w));
    if (allTitle) return line;
  }
  return undefined;
}

function extractAddress(text: string): string | undefined {
  // UK postcode
  const ukPost = text.match(/\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i);
  if (ukPost) {
    // Try to grab the surrounding city/county context
    const idx = text.indexOf(ukPost[0]);
    const nearby = text.slice(Math.max(0, idx - 40), idx + ukPost[0].length).replace(/\n/g, ', ').trim();
    return nearby.length < 80 ? nearby : ukPost[0];
  }
  // US zip
  const usZip = text.match(/\b\d{5}(?:-\d{4})?\b/);
  if (usZip) {
    const idx = text.indexOf(usZip[0]);
    const nearby = text.slice(Math.max(0, idx - 30), idx + usZip[0].length).replace(/\n/g, ', ').trim();
    return nearby.length < 80 ? nearby : usZip[0];
  }
  // Generic "City, Country" or "City, State" pattern
  const cityCountry = text.match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\b/);
  if (cityCountry) return cityCountry[0];
  return undefined;
}

function extractSkills(text: string): string[] {
  const found: string[] = [];
  for (const skill of SKILLS_DB) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`(?:^|[^a-zA-Z])${escaped}(?:[^a-zA-Z]|$)`, 'i').test(text)) {
      found.push(skill);
    }
  }
  return found.slice(0, 25);
}

function extractSummary(text: string): string | undefined {
  // Look for a paragraph under a summary/profile/about heading
  const headingRe = /(?:^|\n)\s*(?:summary|profile|about\s+me|professional\s+summary|career\s+objective|objective)\s*[:\n]/i;
  const match = headingRe.exec(text);
  if (match) {
    const after = text.slice(match.index + match[0].length).trim();
    // Take up to 3 sentences or 300 chars
    const para = after.split(/\n\n/)[0].replace(/\n/g, ' ').trim();
    if (para.length >= 40 && para.length <= 600) return para;
  }

  // Fallback: first "meaty" paragraph (40–400 chars, no dates)
  const paras = text.split(/\n{2,}/);
  for (const p of paras) {
    const clean = p.replace(/\n/g, ' ').trim();
    if (clean.length < 40 || clean.length > 500) continue;
    if (/^\s*\d/.test(clean)) continue; // starts with date/number
    if (/^[A-Z\s]{3,}$/.test(clean)) continue; // all caps heading
    return clean;
  }
  return undefined;
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function extractFromText(text: string): ExtractionResult {
  if (!text || text.trim().length < 10) return {};

  return {
    name:          extractName(text),
    email:         extractEmail(text),
    phone:         extractPhone(text),
    address:       extractAddress(text),
    linkedinUrl:   extractLinkedIn(text),
    portfolioUrls: extractPortfolio(text),
    skills:        extractSkills(text),
    summary:       extractSummary(text),
  };
}

/** Returns true if the result has at least one useful field */
export function hasExtractions(r: ExtractionResult): boolean {
  return !!(r.name || r.email || r.phone || r.address ||
            r.linkedinUrl || r.portfolioUrls?.length ||
            r.skills?.length || r.summary);
}

/** Count non-empty fields */
export function countExtractions(r: ExtractionResult): number {
  let n = 0;
  if (r.name) n++;
  if (r.email) n++;
  if (r.phone) n++;
  if (r.address) n++;
  if (r.linkedinUrl) n++;
  if (r.portfolioUrls?.length) n++;
  if (r.skills?.length) n++;
  if (r.summary) n++;
  return n;
}
