import { createServer, Model, Factory, Response } from "miragejs";
import type { ModelInstance } from "miragejs";

interface JobAttrs {
  id?: string;
  title: string;
  slug: string;
  status: "active" | "archived";
  tags: string[];
  order: number;
  description: string;
  requirements: string[];
  salary: string;
  location: string;
  department: string;
  createdAt: string;
}

interface CandidateAttrs {
  id?: string;
  name: string;
  email: string;
  stage: "applied" | "screen" | "tech" | "offer" | "hired" | "rejected";
  jobId: number;
  phone: string;
  resume: string;
  appliedAt: string;
}

interface AssessmentAttrs {
  id?: string;
  jobId: number;
  questions: Array<{
    id: number;
    question: string;
    type: string;
    required: boolean;
    min?: number;
    max?: number;
  }>;
  createdAt: string;
}

interface TimelineAttrs {
  id?: string;
  candidateId: number;
  stage: string;
  status: string;
  notes: string;
  createdAt: string;
}

export function makeServer({ environment = "production", jobs = [], candidates = [], assessments = [] } = {}) {
  return createServer({
    environment,

    models: {
      job: Model,
      candidate: Model,
      assessment: Model,
      timeline: Model,
    },

    factories: {
      job: Factory.extend({
        title(i: number) {
          const titles = [
            "Senior Frontend Developer",
            "Backend Engineer",
            "Full Stack Developer",
            "DevOps Engineer",
            "Product Manager",
            "UX Designer",
            "Data Scientist",
            "Mobile Developer"
          ];
          return titles[i % titles.length];
        },
        slug(i: number) {
          return `job-${i + 1}`;
        },
        status() {
          return Math.random() > 0.7 ? "archived" : "active";
        },
        tags() {
          const allTags = ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "GraphQL", "MongoDB"];
          const numTags = Math.floor(Math.random() * 4) + 1;
          return allTags.sort(() => 0.5 - Math.random()).slice(0, numTags);
        },
        order(i: number) {
          return i + 1;
        },
        description() {
          return "We are looking for a talented professional to join our growing team...";
        },
        requirements() {
          return ["3+ years experience", "Strong problem-solving skills", "Team player"];
        },
        salary() {
          return "$80,000 - $120,000";
        },
        location() {
          return Math.random() > 0.5 ? "Remote" : "San Francisco, CA";
        },
        department() {
          const departments = ["Engineering", "Product", "Design", "Data"];
          return departments[Math.floor(Math.random() * departments.length)];
        },
        createdAt() {
          return new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
        }
      }),

      candidate: Factory.extend({
        name(i: number) {
          const names = [
            "Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson",
            "Eva Brown", "Frank Miller", "Grace Lee", "Henry Taylor"
          ];
          return names[i % names.length];
        },
        email(i: number) {
          return `candidate${i + 1}@email.com`;
        },
        stage() {
          const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
          return stages[Math.floor(Math.random() * stages.length)];
        },
        jobId() {
          return Math.floor(Math.random() * 5) + 1;
        },
        phone() {
          return `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
        },
        resume() {
          return "resume.pdf";
        },
        appliedAt() {
          return new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
        }
      }),

      assessment: Factory.extend({
        jobId(i: number) {
          return i + 1;
        },
        questions() {
          const questions = [];
          for (let i = 1; i <= 10; i++) {
            questions.push({
              id: i,
              question: `Question ${i}: ${[
                "Describe your experience with React.",
                "Rate your TypeScript skills (1-5).",
                "Explain a challenging bug you fixed.",
                "How do you optimize frontend performance?",
                "What is your experience with Node.js?",
                "Describe a successful team project.",
                "How do you handle code reviews?",
                "Explain your approach to testing.",
                "What is your experience with Docker?",
                "Describe your experience with AWS."
              ][(i-1)%10]}`,
              type: i % 2 === 0 ? "number" : "text",
              required: true,
              min: i % 2 === 0 ? 1 : undefined,
              max: i % 2 === 0 ? 5 : undefined
            });
          }
          return questions;
        },
        createdAt() {
          return new Date().toISOString();
        }
      }),

      timeline: Factory.extend({
        candidateId(i: number) {
          return Math.floor(i / 3) + 1;
        },
        stage() {
          const stages = ["applied", "screen", "tech", "offer"];
          return stages[Math.floor(Math.random() * stages.length)];
        },
        status() {
          return Math.random() > 0.8 ? "rejected" : "completed";
        },
        notes() {
          return "Timeline entry notes...";
        },
        createdAt() {
          return new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString();
        }
      })
    },

    seeds(server) {
      // Seed jobs from Dexie
      if (jobs.length > 0) {
        jobs.forEach(job => {
          server.create("job", { ...job, createdAt: job.createdAt instanceof Date ? job.createdAt.toISOString() : job.createdAt });
        });
      } else {
        server.createList("job", 8);
      }

      // Seed candidates from Dexie
      let seededCandidates = [];
      if (candidates.length > 0) {
        candidates.forEach(candidate => {
          const c = server.create("candidate", { ...candidate, appliedAt: candidate.appliedAt instanceof Date ? candidate.appliedAt.toISOString() : candidate.appliedAt });
          seededCandidates.push(c);
        });
      } else {
        seededCandidates = server.createList("candidate", 15);
      }

      // Seed assessments from Dexie
      if (assessments.length > 0) {
        assessments.forEach(assessment => {
          server.create("assessment", { ...assessment, createdAt: assessment.createdAt instanceof Date ? assessment.createdAt.toISOString() : assessment.createdAt });
        });
      } else {
        server.createList("assessment", 8);
      }

      // Seed timeline events for every candidate
      seededCandidates.forEach((candidate, idx) => {
        const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
        // Give each candidate 2-4 timeline events
        const numEvents = Math.floor(Math.random() * 3) + 2;
        let lastStage = "applied";
        for (let i = 0; i < numEvents; i++) {
          const stage = stages[(stages.indexOf(lastStage) + 1) % stages.length];
          server.create("timeline", {
            candidateId: candidate.id,
            stage,
            status: Math.random() > 0.8 ? "rejected" : "completed",
            notes: `Stage changed to ${stage}`,
            createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
          });
          lastStage = stage;
        }
      });
    },

    routes() {
      this.namespace = "api";

      // Jobs endpoints
      this.get("/jobs", (schema: any, request: any) => {
        const { search = "", status = "", page = "1", pageSize = "10", sort = "order" } = request.queryParams;
        
        let jobs = schema.jobs.all();
        
        // Filter by search
        if (search) {
          jobs = jobs.filter((job: any) => 
            job.attrs.title.toLowerCase().includes(search.toLowerCase()) ||
            job.attrs.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()))
          );
        }
        
        // Filter by status
        if (status) {
          jobs = jobs.filter((job: any) => job.attrs.status === status);
        }
        
        // Sort
        if (sort === "order") {
          jobs = jobs.sort((a: any, b: any) => a.attrs.order - b.attrs.order);
        } else if (sort === "created") {
          jobs = jobs.sort((a: any, b: any) => new Date(b.attrs.createdAt).getTime() - new Date(a.attrs.createdAt).getTime());
        }
        
        // Pagination
        const pageNum = parseInt(page as string);
        const size = parseInt(pageSize as string);
        const total = jobs.length;
        const startIndex = (pageNum - 1) * size;
        const paginatedJobs = jobs.slice(startIndex, startIndex + size);
        
        return {
          data: paginatedJobs.models,
          meta: {
            total,
            page: pageNum,
            pageSize: size,
            totalPages: Math.ceil(total / size)
          }
        };
      });

      this.post("/jobs", (schema: any, request: any) => {
        const attrs = JSON.parse(request.requestBody);
        const maxOrder = Math.max(...schema.jobs.all().models.map((job: any) => job.attrs.order), 0);
        
        return schema.jobs.create({
          ...attrs,
          order: attrs.order || maxOrder + 1,
          createdAt: new Date().toISOString()
        });
      });

      this.patch("/jobs/:id", (schema: any, request: any) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        
        return schema.jobs.find(id).update(attrs);
      });

            // DELETE job endpoint
      this.delete("/jobs/:id", (schema: any, request: any) => {
        const id = request.params.id;
        const job = schema.jobs.find(id);
        if (job) {
          job.destroy();
          return new Response(204, {}, null);
        }
        return new Response(404, {}, { error: "Job not found" });
      });

      this.patch("/jobs/:id/reorder", (schema: any, request: any) => {
        // Occasionally return 500 to test rollback
        if (Math.random() < 0.1) {
          return new Response(500, {}, { error: "Reorder failed" });
        }
        
        const id = request.params.id;
        const { fromOrder, toOrder } = JSON.parse(request.requestBody);
        
        const job = schema.jobs.find(id);
        const allJobs = schema.jobs.all().models;
        
        // Update orders
        if (fromOrder < toOrder) {
          allJobs.forEach((j: any) => {
            if (j.attrs.order > fromOrder && j.attrs.order <= toOrder) {
              j.update({ order: j.attrs.order - 1 });
            }
          });
        } else {
          allJobs.forEach((j: any) => {
            if (j.attrs.order >= toOrder && j.attrs.order < fromOrder) {
              j.update({ order: j.attrs.order + 1 });
            }
          });
        }
        
        job.update({ order: toOrder });
        
        return job;
      });

            // Get job details by id
      this.get("/jobs/:id", (schema: any, request: any) => {
        const id = request.params.id;
        const job = schema.jobs.find(id);
        if (job) {
          return { data: job.attrs };
        }
        return new Response(404, {}, { error: "Job not found" });
      });

      // Get candidate details by id (full interface)
      this.get("/candidates/:id", (schema: any, request: any) => {
        const id = request.params.id;
        const candidate = schema.candidates.find(id);
        if (!candidate) {
          return new Response(404, {}, { error: "Candidate not found" });
        }
        // Get notes and timeline for candidate
        const notes = candidate.attrs.notes || [];
        // Get timeline events from timeline model
        const timelineModels = schema.timelines.where({ candidateId: candidate.id });
        const timeline = timelineModels.models.map((t: any) => t.attrs);
        // Return all fields as per Candidate interface
        return {
          data: {
            ...candidate.attrs,
            notes,
            timeline,
          }
        };
      });

      // Candidates endpoints
      this.get("/candidates", (schema: any, request: any) => {
        const { search = "", stage = "", page = "1" } = request.queryParams;
        
        let candidates = schema.candidates.all();
        
        if (search) {
          candidates = candidates.filter((candidate: any) =>
            candidate.attrs.name.toLowerCase().includes(search.toLowerCase()) ||
            candidate.attrs.email.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        if (stage) {
          candidates = candidates.filter((candidate: any) => candidate.attrs.stage === stage);
        }
        
        const pageNum = parseInt(page as string);
        const pageSize = 10;
        const total = candidates.length;
        const startIndex = (pageNum - 1) * pageSize;
        const paginatedCandidates = candidates.slice(startIndex, startIndex + pageSize);
        
        return {
          data: paginatedCandidates.models,
          meta: {
            total,
            page: pageNum,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
          }
        };
      });

      this.post("/candidates", (schema: any, request: any) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.candidates.create({
          ...attrs,
          appliedAt: new Date().toISOString()
        });
      });

      this.patch("/candidates/:id", (schema: any, request: any) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        
        const candidate = schema.candidates.find(id);
        
        // If stage is changing, create timeline entry
        if (attrs.stage && attrs.stage !== candidate.attrs.stage) {
          schema.timelines.create({
            candidateId: parseInt(id),
            stage: attrs.stage,
            status: "completed",
            notes: `Stage changed to ${attrs.stage}`,
            createdAt: new Date().toISOString()
          });
        }
        
        return candidate.update(attrs);
      });

      this.get("/candidates/:id/timeline", (schema: any, request: any) => {
        const candidateId = parseInt(request.params.id);
        const timeline = schema.timelines.where({ candidateId });
        
        return {
          data: timeline.models.sort((a: any, b: any) => 
            new Date(a.attrs.createdAt).getTime() - new Date(b.attrs.createdAt).getTime()
          )
        };
      });

      // Assessments endpoints
      this.get("/assessments/:jobId", (schema: any, request: any) => {
        const jobId = parseInt(request.params.jobId);
        const assessment = schema.assessments.findBy({ jobId });
        
        return assessment || { data: null };
      });

      this.put("/assessments/:jobId", (schema: any, request: any) => {
        const jobId = parseInt(request.params.jobId);
        const attrs = JSON.parse(request.requestBody);
        
        let assessment = schema.assessments.findBy({ jobId });
        
        if (assessment) {
          return assessment.update(attrs);
        } else {
          return schema.assessments.create({
            ...attrs,
            jobId,
            createdAt: new Date().toISOString()
          });
        }
      });

      this.post("/assessments/:jobId/submit", (schema: any, request: any) => {
        const jobId = request.params.jobId;
        const response = JSON.parse(request.requestBody);
        
        // Store response locally (in localStorage for demo)
        const responses = JSON.parse(localStorage.getItem('assessment_responses') || '{}');
        responses[`${jobId}_${Date.now()}`] = {
          jobId,
          response,
          submittedAt: new Date().toISOString()
        };
        localStorage.setItem('assessment_responses', JSON.stringify(responses));
        
        return { success: true, submittedAt: new Date().toISOString() };
      });

      // New endpoint: Get all assessment questions
      this.get("/assessments/:jobid/questions", (schema: any, request: any) => {
        const jobid = parseInt(request.params.jobid);
        const assessment = schema.assessments.findBy({ jobId: jobid });
        if (assessment && assessment.attrs.questions) {
          return { data: assessment.attrs.questions };
        }
        return { data: [] };
      });

      // Fallback for unhandled requests
      this.passthrough();
    },
  });
}