import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function JobForm({ initial }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || '');
  const [company, setCompany] = useState(initial?.company || '');
  const [location, setLocation] = useState(initial?.location || '');
  const [owner, setOwner] = useState(initial?.owner || '');
  const [jobType, setJobType] = useState(initial?.jobType || 'Remote');
  const [description, setDescription] = useState(initial?.description || '');
  const [status, setStatus] = useState(initial?.status || 'Draft');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = { title, company, location, owner, jobType, description, status };
    const url = initial?._id ? `/api/jobs/${initial._id}` : '/api/jobs';
    const method = initial?._id ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) {
      toast.success('Saved');
      router.push('/jobs');
    } else {
      toast.error('Save failed');
    }
  };

  return (
    <div>
      <form onSubmit={submit} className="card max-w-2xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Title</label>
            <input className="w-full mt-1 border rounded-lg p-2" value={title} onChange={e=>setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">Company</label>
            <input className="w-full mt-1 border rounded-lg p-2" value={company} onChange={e=>setCompany(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">Location</label>
            <input className="w-full mt-1 border rounded-lg p-2" value={location} onChange={e=>setLocation(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">Owner</label>
            <input className="w-full mt-1 border rounded-lg p-2" value={owner} onChange={e=>setOwner(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Job Type</label>
            <select className="w-full mt-1 border rounded-lg p-2" value={jobType} onChange={e=>setJobType(e.target.value)}>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-Site</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Status</label>
            <select className="w-full mt-1 border rounded-lg p-2" value={status} onChange={e=>setStatus(e.target.value)}>
              <option>Draft</option>
              <option>Published</option>
              <option>Closed</option>
              <option>Deactivated</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm">Description</label>
            <textarea rows={8} className="w-full mt-1 border rounded-lg p-2" value={description} onChange={e=>setDescription(e.target.value)} />
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button disabled={saving} className="px-4 py-2 rounded-lg bg-blue-900 text-white">{saving ? 'Saving…' : 'Save'}</button>
          <button type="button" onClick={()=>history.back()} className="pill">Cancel</button>
        </div>
      </form>
    </div>
  );
}
