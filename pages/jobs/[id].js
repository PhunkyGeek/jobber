import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/jobs/${id}`).then(r=>r.json()).then(setJob);
  }, [id]);

  if (!job) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="card p-6">
        <div className="text-xs text-gray-500">{new Date(job.createdAt).toLocaleString()}</div>
        <h1 className="text-2xl font-bold mt-1">{job.title}</h1>
        <div className="mt-2 text-gray-700">
          <div><strong>Company:</strong> {job.company}</div>
          <div><strong>Location:</strong> {job.location}</div>
          <div className="mt-3 whitespace-pre-wrap">{job.description}</div>
        </div>
        <div className="mt-4">
          <span className="badge bg-gray-100">{job.status}</span>
        </div>
      </div>
    </div>
  );
}
