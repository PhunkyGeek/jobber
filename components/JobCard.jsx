import { useState } from 'react';
import { Share2, Pencil, Trash2, Send, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import DeleteJobModal from './DeleteJobModal';
import JobDetailsModal from './JobDetailsModal';

export default function JobCard({ job, onChanged }) {
  const [deleting, setDeleting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);

  if (diff < 60) return `${diff} sec${diff !== 1 ? 's' : ''} ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins} min${mins !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(job.createdAt));

  const copyLink = async () => {
    const link = `${window.location.origin}/jobs/${job._id}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Link copied');
    } catch {
      toast(link);
    }
  };

  const toggleActive = async () => {
    const action = job.active ? 'deactivate' : 'activate';
    const res = await fetch(`/api/jobs/${job._id}/publish`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    if (res.ok) {
      const updated = await res.json();
      onChanged?.(updated);
      toast.success(`Job ${action}d`);
    } else {
      toast.error('Update failed');
    }
  };

  const publish = async () => {
    const res = await fetch(`/api/jobs/${job._id}/publish`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'publish' })
    });
    if (res.ok) {
      const updated = await res.json();
      onChanged?.(updated);
      toast.success('Published');
    } else {
      toast.error('Publish failed');
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-xl shadow-md p-4 border border-gray-300 cursor-pointer hover:shadow-lg transition"
        onClick={() => setShowDetails(true)}
      >
        {/* Date */}
        <div className="text-sm text-gray-500 mb-2">{formattedDate}</div>

        {/* Title + Status */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              job.status === "Published"
                ? "bg-green-100 text-green-700"
                : job.status === "Draft"
                ? "bg-gray-100 text-gray-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {job.status}
          </span>
        </div>

        {/* Applicants + Owner */}
        <div className="flex justify-between text-sm text-black mt-3">
          <span className="font-semibold">
            {job.applicantsCount || 0} Applicants
          </span>
          <span>
            <span className="font-semibold">Owner:</span>{" "}
            {job.owner || "Unknown Owner"}
          </span>
        </div>

        {/* Scores (vertical) */}
        <div className="flex justify-between text-sm text-black mt-6">
          <div className="flex flex-col items-start">
            <span className="font-medium">Evaluation Score</span>
            <span className="font-medium text-base">
              {job.evaluationScore ?? "--"}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium">AI Review Score</span>
            <span className="font-medium text-base">
              {job.aiReviewScore ?? "--"}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium">Hired</span>
            <span className="font-medium text-base">{job.hiredCount ?? 0}</span>
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-4">
          <span className="px-2 py-0.5 bg-blue-50 font-medium text-blue-600 rounded-full">
            {timeAgo(job.createdAt) || "2 days ago"}
          </span>
          {job.jobType && (
            <span className="px-2 py-0.5 bg-blue-50 font-medium text-blue-600 rounded-full">
              {job.jobType}
            </span>
          )}
          <span className="px-2 py-0.5 bg-blue-50 font-medium text-blue-600 rounded-full">
            {job.location}
          </span>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <div className="flex gap-2">
            <Link
              href={`/jobs/edit/${job._id}`}
              onClick={(e) => e.stopPropagation()}
              className="icon-btn"
              title="Edit"
            >
              <Pencil size={18} />
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyLink();
              }}
              className="icon-btn"
              title="Share"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleting(true);
              }}
              className="icon-btn text-red-600"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
            {job.status !== "Published" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  publish();
                }}
                className="icon-btn text-blue-600"
                title="Publish"
              >
                <Send size={18} />
              </button>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleActive();
            }}
            className={`icon-btn w-6 h-3 ${
              job.active ? "bg-blue-600" : "bg-gray-400"
            } rounded-full relative transition-all duration-300`}
            title={job.active ? "Deactivate" : "Activate"}
          >
            <span
              className="absolute w-3 h-3 bg-white rounded-full top-0.5 transition-all duration-300"
              style={{
                transform: job.active ? "translateX(-1px)" : "translateX(-11px)",
              }}
            />
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {deleting && (
        <DeleteJobModal
          jobId={job._id}
          onClose={() => setDeleting(false)}
          onDeleted={() => onChanged?.({ ...job, _deleted: true })}
        />
      )}

      {/* Details Modal */}
      {showDetails && (
        <JobDetailsModal job={job} onClose={() => setShowDetails(false)} />
      )}
    </>
  );
}
