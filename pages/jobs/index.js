import { useState, useMemo } from 'react';
import Link from 'next/link';
import useJobs from '../../hooks/useJobs';
import JobCard from '../../components/JobCard';
import Pagination from '../../components/Pagination';
import FilterBar from '../../components/FilterBar';

export default function JobsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: '', keyword: '' });
  const { jobs, total, limit, loading, mutate } = useJobs({ page, ...filters, limit: 6, sort: '-createdAt' });

  const handleChanged = (updated) => {
    // revalidate when something changes
    mutate();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => history.back()} className="mb-4 text-blue-900 font-medium"><span className="text-xl mr-2">&larr;</span> Go back</button>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-gray-600">Keep track of every open role, from posting to hire.</p>
        </div>
        <Link href="/jobs/create" className="px-4 py-2 rounded-xl bg-blue-900 text-white shadow hover:bg-blue-700">Create Job</Link>
      </div>

      <div className="card p-4 mb-4">
        <FilterBar onFilter={(f)=>{ setFilters(f); setPage(1); }} />
      </div>

      {loading ? (
        <div className="p-6">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job)=> (
            <JobCard key={job._id} job={job} onChanged={handleChanged} />
          ))}
          {jobs.length === 0 && <div className="text-gray-500">No jobs found.</div>}
        </div>
      )}

      <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
    </div>
  );
}
