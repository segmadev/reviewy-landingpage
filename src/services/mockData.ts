import type { ResumeData, User, DashboardMetrics, PricingPlan } from '../types/resume';

export const mockUser: User = {
  id: 'user-001',
  email: 'alex.wright.dev@example.co.uk',
  fullName: 'Alexander Wright',
  role: 'jobseeker',
};

export const mockRecruiterUser: User = {
  id: 'recruiter-001',
  email: 'recruiter@talent.co.uk',
  fullName: 'Sarah Mitchell',
  role: 'recruiter',
};

export const sampleResumeData: ResumeData = {
  contactDetails: {
    fullName: 'Alexander Wright',
    address: '24 Canary Wharf, London, E14 5AB',
    phone: '07700 900123',
    email: 'alex.wright.dev@example.co.uk',
  },
  linkedinProfile: 'https://linkedin.com/in/alexwright-uk-dev',
  portfolioLinks: ['https://github.com/awright-codes', 'https://alexwright.io'],
  professionalSummary:
    'London-based Senior Software Engineer with a decade of expertise in the UK fintech and e-commerce sectors. Highly skilled in the full SDLC, with a particular focus on bridging Backend Engineering and DevOps. Expert in building resilient GitLab CI/CD pipelines and automating cloud infrastructure on AWS/GCP to drive rapid, secure delivery cycles.',
  skills: [
    'Java 21 / Spring Boot',
    'Go',
    'GitLab CI/CD (YAML, Templates, Runners)',
    'Infrastructure as Code (Terraform, CloudFormation)',
    'AWS (EKS, Lambda, Fargate, S3, CloudFront)',
    'Docker & Kubernetes (Helm)',
    'Monitoring (Prometheus, Grafana, AWS CloudWatch)',
    'Security (Snyk, SonarQube, OWASP Scanning)',
    'Test Driven Development (TDD/JUnit)',
  ],
  workExperience: [
    {
      id: 'exp-1',
      company: 'Global Fintech Hub (London)',
      position: 'Senior Software Engineer / Tech Lead',
      startDate: '2021-05-01',
      endDate: '2024-04-11',
      responsibilities: [
        'Architected the migration of the core UK lending platform to a microservices architecture on AWS EKS, achieving 99.99% uptime.',
        'Managed a cross-functional team of 8 engineers, fostering a DevSecOps culture that prioritised security and automation.',
        'Engineered zero-downtime deployment strategies (Blue/Green & Canary) using AWS CodeDeploy and Route53.',
      ],
    },
    {
      id: 'exp-2',
      company: 'NextGen Retail Systems (Bristol/Remote)',
      position: 'DevOps-Focused Software Engineer',
      startDate: '2018-02-01',
      endDate: '2021-04-30',
      responsibilities: [
        'Designed and implemented a comprehensive GitLab CI/CD framework from scratch, automating the build-test-deploy cycle for 40+ microservices.',
        'Integrated Security-as-Code into pipelines using Snyk and SonarQube, reducing vulnerabilities by 60%.',
        'Automated the provisioning of AWS environments using Terraform, ensuring 100% environment parity.',
      ],
    },
    {
      id: 'exp-3',
      company: 'Silicon Roundabout Start-up',
      position: 'Software Engineer',
      startDate: '2015-10-01',
      endDate: '2018-01-15',
      responsibilities: [
        'Developed RESTful Java services for a high-traffic e-commerce aggregator, handling peaks of 5k requests per second.',
        'Collaborated on the initial containerisation of legacy services, moving from bare-metal to Dockerised environments.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Imperial College London',
      degree: 'MSc Advanced Computing (Distinction)',
      startDate: '2014-10-01',
      endDate: '2015-09-30',
    },
    {
      id: 'edu-2',
      institution: 'University of Manchester',
      degree: 'BSc (Hons) Computer Science (First Class)',
      startDate: '2011-09-20',
      endDate: '2014-06-15',
    },
  ],
  relevantCourseWork: 'Distributed Systems, Cloud Infrastructure Automation, Cyber Security',
  certifications: [
    {
      id: 'cert-1',
      title: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      date: '2023-01-15',
    },
    {
      id: 'cert-2',
      title: 'Google Cloud Professional Cloud Architect',
      issuer: 'Google Cloud',
      date: '2022-06-10',
    },
    {
      id: 'cert-3',
      title: 'GitLab Certified Professional',
      issuer: 'GitLab',
      date: '2020-05-12',
    },
  ],
  references: [
    {
      id: 'ref-1',
      name: 'David Sterling',
      position: 'VP of Engineering',
      company: 'Global Fintech Hub',
      contact: 'd.sterling@fintechhub.co.uk',
    },
  ],
  languages: ['English (Native)', 'French (Conversational)'],
  awards: ['National Award for Technical Excellence 2023'],
  hobbies: ['Open Source Contribution', 'Technical Blogging', 'Rock Climbing'],
};

export const mockDashboardMetrics: DashboardMetrics = {
  cvViews: 248,
  unlocks: 14,
  rank: 3,
  viewsThisWeek: [12, 19, 15, 28, 34, 22, 40],
  pipelineBreakdown: [
    { label: 'Viewed', value: 55, color: '#65B026' },
    { label: 'Shortlisted', value: 25, color: '#2C3E50' },
    { label: 'Unlocked', value: 15, color: '#3498DB' },
    { label: 'Contacted', value: 5, color: '#E67E22' },
  ],
};

export const mockPricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 49, annual: 39, credits: 5 },
    features: [
      '5 CV unlocks per month',
      'Basic candidate filtering',
      'Email support',
      'Standard response time',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: { monthly: 149, annual: 119, credits: 20 },
    features: [
      '20 CV unlocks per month',
      'Advanced AI matching',
      'Priority support',
      'Talent pipeline dashboard',
      'Bulk unlock discounts',
    ],
    featured: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: { monthly: 349, annual: 279, credits: 60 },
    features: [
      '60 CV unlocks per month',
      'Dedicated account manager',
      'Custom integrations (ATS)',
      'Team seats included',
      'Analytics & reporting',
      'SLA guarantee',
    ],
  },
];

export const aiSkillSuggestions = [
  'Project Management', 'Agile / Scrum', 'Node.js', 'Python', 'React',
  'TypeScript', 'GraphQL', 'PostgreSQL', 'Redis', 'CI/CD Pipelines',
  'Azure', 'GCP', 'Linux / Bash', 'REST APIs', 'Microservices',
];

export const aiTailoredBullets: Record<string, string[]> = {
  default: [
    'Delivered scalable solutions aligned with business KPIs, reducing operational costs by 30%.',
    'Led cross-functional teams using Agile/Scrum methodology, achieving sprint goals consistently.',
    'Implemented automated testing suites increasing code coverage from 45% to 90%.',
    'Mentored junior engineers, conducting code reviews and knowledge-sharing sessions.',
  ],
};
