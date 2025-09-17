import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { makeServer } from './lib/mirage';
import { db, Job } from './lib/database'; // Import Job interface for typing

async function startApp() {

  let jobs: Job[] = [];
  let candidates = [];
  let assessments = [];
  try {
    jobs = await db.jobs.toArray();
    candidates = await db.candidates.toArray();
    assessments = await db.assessments.toArray();
    console.log('Fetched jobs:', jobs);
    console.log('Fetched candidates:', candidates);
    console.log('Fetched assessments:', assessments);
  } catch (err) {
    console.error('Failed to fetch Dexie data:', err);
    jobs = [];
    candidates = [];
    assessments = [];
  }

  if (import.meta.env.DEV) {
    console.log('Passing jobs, candidates, assessments to Mirage:', { jobs, candidates, assessments });
    makeServer({ jobs, candidates, assessments });
  }

  createRoot(document.getElementById('root')!).render(<App />);
}




startApp();