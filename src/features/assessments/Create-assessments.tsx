// ...existing code from src/pages/Create-assessments.tsx...


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { db, Assessment } from '@/lib/database';

export default function CreateAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [newAssessment, setNewAssessment] = useState({
    jobId: '',
    title: '',
    description: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    db.assessments.toArray().then(setAssessments).catch((error) => {
      console.error('Failed to fetch assessments:', error);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAssessment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const assessment: Assessment = {
      jobId: parseInt(newAssessment.jobId),
      title: newAssessment.title,
      description: newAssessment.description,
      sections: [], // Add sections later if needed
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.assessments.add(assessment);
    setAssessments(await db.assessments.toArray());
    setNewAssessment({ jobId: '', title: '', description: '' }); // Reset form
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Assessments</h2>

      {/* Form to create a new assessment */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
        <div className="mb-4">
          <label className="block mb-1">Job ID</label>
          <input
            type="number"
            name="jobId"
            value={newAssessment.jobId}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={newAssessment.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={newAssessment.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Add Assessment
        </button>
      </form>

      {/* List of assessments */}
      <ul className="space-y-2">
        {assessments.length > 0 ? (
          assessments.map((assessment) => (
            <li
              key={assessment.id}
              className="p-2 border rounded cursor-pointer hover:bg-muted"
              onClick={() => navigate(`/assessment/${assessment.jobId}`)}
            >
              <strong>{assessment.title}</strong> — {assessment.description}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No assessments available.</p>
        )}
      </ul>
    </Layout>
  );
}