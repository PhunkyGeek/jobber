import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import JobForm from '../../../components/JobForm';

export default function EditJobPage() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState(null);
  useEffect(() => {
    if (!id) return;
    fetch(`/api/jobs/${id}`).then(r=>r.json()).then(setJob);
  }, [id]);

  if (!job) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Edit Job</h2>
      <JobForm initial={job} />
    </div>
  );
}
