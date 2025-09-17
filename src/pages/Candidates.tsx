import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { db, Candidate } from '@/lib/database';
import { Layout } from '@/components/layout/Layout';
import { sendCandidateEmail } from '@/lib/sendCandidateEmail';


export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    db.candidates.count().then(setTotal);
    db.candidates
      .orderBy('appliedAt')
      .reverse()
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .toArray()
      .then(setCandidates);
  }, [page]);

  async function openCandidateDetails(id: number) {
    setShowModal(true);
    // Fetch candidate details
    const res = await fetch(`/api/candidates/${id}`);
    const data = await res.json();
    setSelectedCandidate(data.data);
    // Fetch timeline
    const timelineRes = await fetch(`/api/candidates/${id}/timeline`);
    const timelineData = await timelineRes.json();
    setTimeline(timelineData.data || []);
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Candidates</h2>
      <ul className="space-y-2">
        {candidates.map(candidate => (
          <li
            key={candidate.id}
            className="p-2 border rounded flex items-center justify-between cursor-pointer hover:bg-muted"
            onClick={() => openCandidateDetails(candidate.id!)}
          >
            <div>
              <strong>{candidate.name}</strong> — {candidate.email} ({candidate.stage})
            </div>
            <div className="flex gap-2">
              {candidate.stage === 'rejected' && (
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={e => { e.stopPropagation(); sendCandidateEmail(candidate.email, candidate.name, 'rejected'); }}
                >
                  Send Rejection Email
                </button>
              )}
              {candidate.stage === 'hired' && (
                <button
                  className="px-2 py-1 bg-green-500 text-white rounded"
                  onClick={e => { e.stopPropagation(); sendCandidateEmail(candidate.email, candidate.name, 'hired'); }}
                >
                  Send Selection Email
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {showModal && selectedCandidate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 transition-opacity duration-700 ease-in-out">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px] max-w-lg w-full relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h3 className="text-xl font-bold mb-2">Candidate Details</h3>
            <div className="mb-4 text-left">
              {Object.entries(selectedCandidate).map(([key, value]) => (
                key !== 'timeline' && key !== 'notes' ? (
                  <div key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {String(value)}</div>
                ) : null
              ))}
            </div>
            {selectedCandidate.resume && (
              <div className="mb-2"><strong>Resume:</strong> {selectedCandidate.resume}</div>
            )}
            <h4 className="text-lg font-semibold mb-2">Notes</h4>
            <div className="mb-4">
              {selectedCandidate.notes && selectedCandidate.notes.length > 0 ? (
                selectedCandidate.notes.map((note: any, idx: number) => (
                  <div key={note.id || idx} className="mb-2">
                    <div><strong>Note:</strong> {note.content || note}</div>
                    {note.authorId && <div className="text-xs text-gray-500">Author ID: {note.authorId}</div>}
                    {note.createdAt && <div className="text-xs text-gray-500">Created At: {note.createdAt}</div>}
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No notes.</div>
              )}
            </div>
            <h4 className="text-lg font-semibold mb-2">Timeline</h4>
            <div className="border-l-2 border-primary pl-4">
              {selectedCandidate.timeline && selectedCandidate.timeline.length > 0 ? (
                selectedCandidate.timeline.map((event: any, idx: number) => (
                  <div key={event.id || idx} className="mb-4 relative">
                    <div className="absolute -left-6 top-0 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
                    <div className="ml-2">
                      {Object.entries(event).map(([ekey, evalue]) => (
                        <div key={ekey} className="text-xs"><strong>{ekey.charAt(0).toUpperCase() + ekey.slice(1)}:</strong> {String(evalue)}</div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No timeline events.</div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 mt-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </Layout>
  );
}
