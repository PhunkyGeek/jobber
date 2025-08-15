export default function Pagination({ page, total, limit, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded-lg border ${p === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'}`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
