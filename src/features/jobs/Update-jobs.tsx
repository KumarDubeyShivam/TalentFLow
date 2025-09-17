// ...existing code from src/pages/Update-jobs.tsx...

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateJobs() {
  const { jobid } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      try {
        const res = await fetch(`/api/jobs/${jobid}`);
        const data = await res.json();
        setJob(data.data);
      } catch (err) {
        setError('Failed to fetch job');
      }
      setLoading(false);
    }
    if (jobid) fetchJob();
  }, [jobid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`/api/jobs/${jobid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      });
      if (res.ok) {
        navigate('/jobs');
      } else {
        setError('Failed to update job');
      }
    } catch (err) {
      setError('Failed to update job');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!job) return <div className="p-6">Job not found.</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Update Job</h2>
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate('/jobs')}
      >
        ← Back to Jobs
      </button>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input name="title" value={job.title || ''} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" value={job.description || ''} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
        </div>
        {/* Add more fields as needed */}
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Update Job</button>
      </form>
    </div>
  );
}
