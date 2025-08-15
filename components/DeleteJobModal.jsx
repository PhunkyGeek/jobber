import toast from 'react-hot-toast';

export default function DeleteJobModal({ jobId, onClose, onDeleted }) {
  const handleDelete = async () => {
    const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Job deleted');
      onDeleted?.();
      onClose?.();
    } else {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="card w-[420px] p-6">
        <h2 className="text-lg font-semibold">Delete job?</h2>
        <p className="text-sm text-gray-600 mt-1">This action cannot be undone.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="pill">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
}
