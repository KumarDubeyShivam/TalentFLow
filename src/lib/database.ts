import Dexie, { Table } from 'dexie';

// Types for our TalentFlow platform
export interface User {
  id?: number;
  email: string;
  password: string;
  name: string;
  role: 'recruiter' | 'applicant';
  avatar?: string;
  createdAt: Date;
}

export interface Job {
  id?: number;
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  salary?: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'intern';
  recruiterId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Candidate {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  resume?: Blob; // PDF file
  coverLetter?: string;
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
  jobId: number;
  appliedAt: Date;
  notes: CandidateNote[];
  timeline: StageChange[];
}

export interface CandidateNote {
  id: string;
  content: string;
  authorId: number;
  createdAt: Date;
  mentions: string[];
}

export interface StageChange {
  id: string;
  fromStage?: string;
  toStage: string;
  changedBy: number;
  changedAt: Date;
  notes?: string;
}

export interface Assessment {
  id?: number;
  jobId: number;
  title: string;
  description: string;
  sections: AssessmentSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentSection {
  id: string;
  title: string;
  questions: Question[];
  order: number;
}

export interface Question {
  id: string;
  type: 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file-upload';
  question: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    maxLength?: number;
  };
  conditionalLogic?: {
    showIf: {
      questionId: string;
      value: string;
    };
  };
  order: number;
}

export interface AssessmentResponse {
  id?: number;
  assessmentId: number;
  candidateId: number;
  responses: QuestionResponse[];
  submittedAt: Date;
  completed: boolean;
}

export interface QuestionResponse {
  questionId: string;
  value: string | string[] | number;
}

// Dexie Database
export class TalentFlowDB extends Dexie {
  users!: Table<User>;
  jobs!: Table<Job>;
  candidates!: Table<Candidate>;
  assessments!: Table<Assessment>;
  assessmentResponses!: Table<AssessmentResponse>;

  constructor() {
    super('TalentFlowDB');
    console.log('Database initializing...');
     this.version(1).stores({
       users: '++id, email, role',
       jobs: '++id, slug, status, recruiterId, order, createdAt',
       candidates: '++id, email, jobId, stage, appliedAt',
       assessments: '++id, jobId, createdAt', // added createdAt index
       assessmentResponses: '++id, assessmentId, candidateId',
     });
    console.log('Database initialized');
  }
}

export const db = new TalentFlowDB();

// Seed data function
export async function seedDatabase() {

  

  const userCount = await db.users.count();
  if (userCount > 0) return; // Already seeded

  // Create default users
  const recruiterIds = await db.users.bulkAdd([
    {
      email: 'recruiter@talentflow.com',
      password: 'password123',
      name: 'Sarah Johnson',
      role: 'recruiter',
      createdAt: new Date(),
    },
    {
      email: 'hr@talentflow.com',
      password: 'password123',
      name: 'Michael Chen',
      role: 'recruiter',
      createdAt: new Date(),
    },
  ]);

  // Create sample applicants
  const applicantIds = await db.users.bulkAdd([
    {
      email: 'john.doe@email.com',
      password: 'password123',
      name: 'John Doe',
      role: 'applicant',
      createdAt: new Date(),
    },
    {
      email: 'jane.smith@email.com',
      password: 'password123',
      name: 'Jane Smith',
      role: 'applicant',
      createdAt: new Date(),
    },
  ]);

  // Create sample jobs
  const jobs = Array.from({ length: 1000 }, (_, i) => ({
    title: `${['Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'DevOps Engineer', 'Product Manager', 'UI/UX Designer', 'Data Scientist', 'Mobile Developer'][i % 8]}`,
    slug: `job-${i + 1}`,
    description: 'Join our dynamic team and make an impact on millions of users worldwide.',
    requirements: ['3+ years experience', 'Strong technical skills', 'Team player'],
    status: Math.random() > 0.3 ? 'active' : 'archived' as 'active' | 'archived',
    tags: ['Tech', 'Remote', 'Full-time'][Math.floor(Math.random() * 3)] ? ['Tech'] : ['Remote'],
    order: i,
    salary: '$80,000 - $120,000',
    location: ['San Francisco', 'New York', 'Remote', 'London'][Math.floor(Math.random() * 4)],
    type: 'full-time' as const,
    recruiterId: recruiterIds[0],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }));

  await db.jobs.bulkAdd(jobs);

  // Fetch all jobs to get their actual IDs
  const allJobs = await db.jobs.toArray();

  // Create 50 candidates
  const stages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'] as const;
  const candidates = Array.from({ length: 50 }, (_, i) => ({
    name: `Candidate ${i + 1}`,
    email: `candidate${i + 1}@email.com`,
    phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    stage: stages[Math.floor(Math.random() * stages.length)],
    jobId: allJobs[Math.floor(Math.random() * allJobs.length)]?.id,
    appliedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
    notes: [],
    timeline: [],
  }));

  await db.candidates.bulkAdd(candidates);

  // Add sample assessments
  const assessments = Array.from({ length: 10 }, (_, i) => ({
    jobId: allJobs[i % allJobs.length]?.id, // Link to existing jobs
    title: `Assessment for ${['Technical Skills', 'Behavioral Interview', 'Coding Test', 'Design Review', 'Presentation'][i]}`,
    description: `Evaluation for ${['technical expertise', 'soft skills', 'coding ability', 'design skills', 'presentation skills'][i]}.`,
    sections: [
      {
        id: `section-${i + 1}`,
        title: `Section ${i + 1}`,
        questions: [
          {
            id: `q-${i + 1}-1`,
            type: 'short-text' as const,
            question: `Question ${i + 1}-1 for ${['technical', 'behavioral', 'coding', 'design', 'presentation'][i]} evaluation`,
            required: true,
            order: 1,
          },
        ],
        order: 1,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await db.assessments.bulkAdd(assessments);

  // Log seeded assessments for debugging
  console.log('Seeded assessments:', assessments.map(a => ({ jobId: a.jobId, title: a.title })));

  console.log('Database seeded successfully!');
}