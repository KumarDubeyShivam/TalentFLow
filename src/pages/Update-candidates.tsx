import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateCandidates() {
  const { candidateid } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCandidate() {
      setLoading(true);
      try {
        const res = await fetch(`/api/candidates/${candidateid}`);
        const data = await res.json();
        setCandidate(data.data);
      } catch (err) {
        setError('Failed to fetch candidate');
      }
      setLoading(false);
    }
    if (candidateid) fetchCandidate();
  }, [candidateid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCandidate({ ...candidate, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`/api/candidates/${candidateid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate)
      });
      if (res.ok) {
        navigate('/candidates');
      } else {
        setError('Failed to update candidate');
      }
    } catch (err) {
      setError('Failed to update candidate');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!candidate) return <div className="p-6">Candidate not found.</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Update Candidate</h2>
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate('/candidates')}
      >
        ← Back to Candidates
      </button>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input name="name" value={candidate.name || ''} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input name="email" value={candidate.email || ''} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Phone</label>
          <input name="phone" value={candidate.phone || ''} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Stage</label>
          <input name="stage" value={candidate.stage || ''} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
        </div>
        {/* Add more fields as needed */}
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Update Candidate</button>
      </form>
    </div>
  );
}
