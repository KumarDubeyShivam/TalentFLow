// ...existing code from src/pages/Create-jobs.tsx...

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateJobs() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    requirements: '',
    status: 'active',
    tags: '',
    salary: '',
    location: '',
    type: 'full-time',
    recruiterId: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submitJob(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split(',').map(r => r.trim()),
        tags: form.tags.split(',').map(t => t.trim()),
        recruiterId: Number(form.recruiterId),
      };
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create job');
      setSuccess(true);
      setForm({
        title: '', slug: '', description: '', requirements: '', status: 'active', tags: '', salary: '', location: '', type: 'full-time', recruiterId: '',
      });
    } catch (err: any) {
      setError(err.message || 'Error creating job');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Job</h2>
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>
      <form className="space-y-4" onSubmit={submitJob}>
        <input name="title" value={form.title} onChange={handleChange} required placeholder="Title" className="w-full border rounded px-3 py-2" />
        <input name="slug" value={form.slug} onChange={handleChange} required placeholder="Slug" className="w-full border rounded px-3 py-2" />
        <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Description" className="w-full border rounded px-3 py-2" />
        <input name="requirements" value={form.requirements} onChange={handleChange} required placeholder="Requirements (comma separated)" className="w-full border rounded px-3 py-2" />
        <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full border rounded px-3 py-2" />
        <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary" className="w-full border rounded px-3 py-2" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border rounded px-3 py-2" />
        <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="intern">Intern</option>
        </select>
        <input name="recruiterId" value={form.recruiterId} onChange={handleChange} required placeholder="Recruiter ID" className="w-full border rounded px-3 py-2" />
        <button type="submit" className="w-full bg-primary text-white py-2 rounded" disabled={loading}>
          {loading ? 'Creating...' : 'Create Job'}
        </button>
      </form>
      {success && <p className="text-green-600 mt-4">Job created successfully!</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
