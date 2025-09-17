import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateCandidates() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    stage: 'applied',
    jobId: '',
    appliedAt: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submitCandidate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const payload = {
        ...form,
        jobId: Number(form.jobId),
        appliedAt: form.appliedAt || new Date().toISOString(),
      };
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create candidate');
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', stage: 'applied', jobId: '', appliedAt: '' });
    } catch (err: any) {
      setError(err.message || 'Error creating candidate');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Candidate</h2>
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate('/')}
      >
        ← Back to Dashboard
      </button>
      <form className="space-y-4" onSubmit={submitCandidate}>
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Name" className="w-full border rounded px-3 py-2" />
        <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" className="w-full border rounded px-3 py-2" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border rounded px-3 py-2" />
        <select name="stage" value={form.stage} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="applied">Applied</option>
          <option value="screen">Screen</option>
          <option value="tech">Tech</option>
          <option value="offer">Offer</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
        <input name="jobId" value={form.jobId} onChange={handleChange} required placeholder="Job ID" className="w-full border rounded px-3 py-2" />
        <input name="appliedAt" value={form.appliedAt} onChange={handleChange} placeholder="Applied At (ISO, optional)" className="w-full border rounded px-3 py-2" />
        <button type="submit" className="w-full bg-primary text-white py-2 rounded" disabled={loading}>
          {loading ? 'Creating...' : 'Create Candidate'}
        </button>
      </form>
      {success && <p className="text-green-600 mt-4">Candidate created successfully!</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
