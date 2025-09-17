import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { db, Assessment } from '@/lib/database';

export default function UpdateAssessments() {
  const { assessmentid } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssessment() {
      setLoading(true);
      try {
        if (assessmentid) {
          const id = parseInt(assessmentid);
          const found = await db.assessments.get(id);
          setAssessment(found || null);
        }
      } catch (err) {
        setError('Failed to fetch assessment');
      }
      setLoading(false);
    }
    fetchAssessment();
  }, [assessmentid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!assessment) return;
    setAssessment({ ...assessment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (assessment && assessment.id) {
        // Only update changed fields (title, description, etc.)
        await db.assessments.update(assessment.id, {
          title: assessment.title,
          description: assessment.description,
          // Add more fields as needed
          updatedAt: new Date(),
        });
        navigate('/assessments');
      }
    } catch (err) {
      setError('Failed to update assessment');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!assessment) return <div className="p-6">Assessment not found.</div>;

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Update Assessment</h2>
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate('/assessments')}
      >
        ← Back to Assessments
      </button>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input name="title" value={assessment.title || ''} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <input name="description" value={assessment.description || ''} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
        </div>
        {/* Add more fields as needed */}
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Update Assessment</button>
      </form>
    </Layout>
  );
}
