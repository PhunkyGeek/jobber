import { useState } from 'react';
import {
  Share2,
  Pencil,
  Trash2,
  Send,
  X as XIcon,
  Instagram,
  Linkedin,
  Copy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import DeleteJobModal from './DeleteJobModal';
import JobDetailsModal from './JobDetailsModal';

export default function JobCard({ job, onChanged }) {
  const [deleting, setDeleting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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
    year: 'numeric',
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
      body: JSON.stringify({ action }),
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
      body: JSON.stringify({ action: 'publish' }),
    });
    if (res.ok) {
      const updated = await res.json();
      onChanged?.(updated);
      toast.success('Published');
    } else {
      toast.error('Publish failed');
    }
  };

  const shareLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/jobs/${job._id}`;

  return (
    <>
      <div
        className="bg-white rounded-xl shadow-md p-4 border border-gray-300 cursor-pointer hover:shadow-lg transition"
        onClick={() => setShowDetails(true)}
      >
        <div className="text-sm text-gray-500 mb-2">{formattedDate}</div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              job.status === 'Published'
                ? 'bg-green-100 text-green-700'
                : job.status === 'Draft'
                ? 'bg-gray-100 text-gray-700'
                : job.status === 'Closed'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {job.status}
          </span>
        </div>

        <div className="flex justify-between text-sm text-black mt-3">
          <span className="font-semibold">{job.applicantsCount || 0} Applicants</span>
          <span>
            <span className="font-semibold">Owner:</span>{' '}
            {job.owner || 'Unknown Owner'}
          </span>
        </div>

        <div className="flex justify-between text-sm text-black mt-6">
          <div className="flex flex-col items-start">
            <span className="font-medium">Evaluation Score</span>
            <span className="font-medium text-base">{job.evaluationScore ?? '--'}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium">AI Review Score</span>
            <span className="font-medium text-base">{job.aiReviewScore ?? '--'}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium">Hired</span>
            <span className="font-medium text-base">{job.hiredCount ?? 0}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-4">
          <span className="px-2 py-0.5 bg-blue-50 font-medium text-blue-600 rounded-full">
            {timeAgo(job.createdAt) || '2 days ago'}
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
                setShowShareModal(true);
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
            {job.status !== 'Published' && (
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
              job.active ? 'bg-blue-600' : 'bg-gray-400'
            } rounded-full relative transition-all duration-300`}
            title={job.active ? 'Deactivate' : 'Activate'}
          >
            <span
              className="absolute w-3 h-3 bg-white rounded-full top-0.5 transition-all duration-300"
              style={{
                transform: job.active ? 'translateX(-1px)' : 'translateX(-11px)',
              }}
            />
          </button>
        </div>
      </div>

      {deleting && (
        <DeleteJobModal
          jobId={job._id}
          onClose={() => setDeleting(false)}
          onDeleted={() => onChanged?.({ ...job, _deleted: true })}
        />
      )}

      {showDetails && (
        <JobDetailsModal job={job} onClose={() => setShowDetails(false)} />
      )}

      {showShareModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Share Job</h2>
              <button onClick={() => setShowShareModal(false)}>
                <XIcon size={20} />
              </button>
            </div>
            <div className="flex gap-4">
              <button
                onClick={copyLink}
                className="icon-btn"
                title="Copy Link"
              >
                <Copy size={20} />
              </button>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  shareLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                title="Share on LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  shareLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                title="Share on X"
              >
                <XIcon size={20} />
              </a>
              <a
                href={`https://www.instagram.com/`}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                title="Share on Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
