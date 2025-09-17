// ...existing code from src/pages/AssessmentDetail.tsx...

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

export default function AssessmentDetail() {
  const { jobid } = useParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        if (!jobid) throw new Error('Missing job ID');
        const res = await fetch(`/api/assessments/${jobid}/questions`);
        const data = await res.json();
        setQuestions(data.data || []);
      } catch (err) {
        setError('Failed to fetch questions');
      }
      setLoading(false);
    }
    fetchQuestions();
  }, [jobid]);

  const handleChange = (id: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!jobid) {
      setError('Missing job ID');
      return;
    }
    try {
      const res = await fetch(`/api/assessments/${jobid}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: questions.map(q => ({ questionId: q.id, value: answers[q.id] })) })
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Submission failed');
      }
    } catch (err) {
      setError('Submission failed');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto mb-4" />
          <p>Loading assessment questions...</p>
        </div>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout>
        <h2 className="text-2xl font-bold mb-4">Assessment Submitted</h2>
        <p>Thank you for submitting your answers!</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Assessment Form</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="border p-4 rounded">
            <label className="block font-semibold mb-2">{q.question}</label>
            {q.type === 'text' ? (
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                required={q.required}
                value={answers[q.id] || ''}
                onChange={e => handleChange(q.id, e.target.value)}
              />
            ) : q.type === 'number' ? (
              <input
                type="number"
                className="border rounded px-2 py-1 w-full"
                required={q.required}
                min={q.min}
                max={q.max}
                value={answers[q.id] || ''}
                onChange={e => handleChange(q.id, e.target.value)}
              />
            ) : null}
          </div>
        ))}
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Submit</button>
      </form>
    </Layout>
  );
}