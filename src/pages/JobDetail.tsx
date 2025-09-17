import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { db, Job } from '@/lib/database';

export default function JobDetail() {
  const { jobid } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (jobid) {
      db.jobs.where('id').equals(Number(jobid)).first()
        .then((result) => {
          setJob(result || null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [jobid]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto mb-4" />
          <p>Loading job...</p>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <p>Job not found for ID: {jobid}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
      <div className="p-4 border rounded">
        <p><strong>ID:</strong> {job.id}</p>
        <p><strong>Description:</strong> {job.description}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Status:</strong> {job.status}</p>
        <p><strong>Type:</strong> {job.type}</p>
        <p><strong>Salary:</strong> {job.salary}</p>
        <p><strong>Recruiter ID:</strong> {job.recruiterId}</p>
        <button
          className="mt-6 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80"
          onClick={() => navigate(`/apply/${job.id}`)}
        >
          Apply
        </button>
      </div>
    </Layout>
  );
}
