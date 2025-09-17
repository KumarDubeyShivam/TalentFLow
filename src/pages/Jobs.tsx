import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { db, Job } from '@/lib/database';

export default function Jobs() {
  const [showModal, setShowModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("order");
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  async function sort_jobs(searchValue: string, statusValue: string, sortValue: string, page: number, pageSize: number) {
    let url = `/api/jobs?page=${page}&pageSize=${pageSize}`;
    if (searchValue) url += `&search=${encodeURIComponent(searchValue)}`;
    if (statusValue) url += `&status=${encodeURIComponent(statusValue)}`;
    if (sortValue) url += `&sort=${encodeURIComponent(sortValue)}`;
    const res = await fetch(url);
    const data = await res.json();
    setJobs(data.data);
    setTotal(data.meta.total);
  }

  async function delete_jobs(id: number) {
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    setShowModal(false);
    setJobToDelete(null);
    get_jobs(page, pageSize);
  }

  async function get_jobs(page: number, pageSize: number) {
    await sort_jobs(search, status, sort, page, pageSize);
  }

  useEffect(() => {
    get_jobs(page, pageSize);
  }, [page, search, status, sort, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Jobs</h2>
  <div className="flex gap-2 mb-4">
        <select
          className="border rounded px-2 py-1"
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
        <input
          type="text"
          className="border rounded px-2 py-1 w-64"
          placeholder="Search jobs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setPage(1);
              sort_jobs(e.currentTarget.value, status, sort, 1, pageSize);
            }
          }}
        />
        <select
          className="border rounded px-2 py-1"
          value={status}
          onChange={e => {
            setStatus(e.target.value);
            setPage(1);
            sort_jobs(search, e.target.value, sort, 1, pageSize);
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <select
          className="border rounded px-2 py-1"
          value={sort}
          onChange={e => {
            setSort(e.target.value);
            setPage(1);
            sort_jobs(search, status, e.target.value, 1, pageSize);
          }}
        >
          <option value="order">Sort by Order</option>
          <option value="created">Sort by Created</option>
        </select>
        <button
          className="px-3 py-1 border rounded bg-primary text-white"
          onClick={() => {
            setPage(1);
            sort_jobs(search, status, sort, 1, pageSize);
          }}
        >
          🔍
        </button>
      </div>
      <ul className="space-y-2">
        {jobs.map(job => (
          <li
            key={job.id}
            className="p-2 border rounded flex items-center justify-between hover:bg-muted"
          >
            <span className="cursor-pointer" onClick={() => navigate(`/job/${job.id}`)}>
              <strong>{job.title}</strong> — {job.location} ({job.status})
            </span>
            <button
              className="ml-4 px-2 py-1 bg-red-500 text-white rounded"
              onClick={e => {
                e.stopPropagation();
                setJobToDelete(job);
                setShowModal(true);
              }}
            >
              Delete
            </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 transition-opacity duration-700 ease-in-out" style={{ animation: 'fadeIn 1s' }}>
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] text-center relative" style={{ transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)' }}>
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete <strong>{jobToDelete?.title}</strong>?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors"
                onClick={() => { setShowModal(false); setJobToDelete(null); }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                onClick={() => jobToDelete && delete_jobs(jobToDelete.id!)}
              >
                Delete
              </button>
            </div>
          </div>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>
      )}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 mt-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => {
            setPage(page - 1);
            sort_jobs(search, status, sort, page - 1, pageSize);
          }}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => {
            setPage(page + 1);
            sort_jobs(search, status, sort, page + 1, pageSize);
          }}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </Layout>
  );
}
