import { X } from 'lucide-react';

export default function JobDetailsModal({ job, onClose }) {
  if (!job) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-bold">{job.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="font-medium">
              {new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }).format(new Date(job.createdAt))}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                job.status === 'Published'
                  ? 'bg-green-100 text-green-700'
                  : job.status === 'Draft'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {job.status}
            </span>
            <span>Owner: {job.owner || 'Unknown'}</span>
            <span>{job.applicantsCount || 0} Applicants</span>
          </div>

          {/* Scores */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-700">
            <span>Evaluation Score: {job.evaluationScore ?? '-'}</span>
            <span>AI Review Score: {job.aiReviewScore ?? '-'}</span>
            <span>Hired: {job.hiredCount ?? 0}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <span>{job.timeAgo || '2 days ago'}</span>
            {job.jobType && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-900 rounded-full">
                {job.jobType}
              </span>
            )}
            <span className="px-2 py-0.5 bg-blue-50 text-blue-900 rounded-full">{job.location}</span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {job.description || 'No description provided.'}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Benefits</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {job.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
