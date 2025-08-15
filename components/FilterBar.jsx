import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

export default function FilterBar({ onFilter }) {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [owner, setOwner] = useState('');
  const [datePosted, setDatePosted] = useState('');

  const go = (e) => {
    e?.preventDefault();
    onFilter({ keyword, status, department, location, owner, datePosted });
  };

  return (
    <form onSubmit={go} className="flex flex-wrap gap-3 items-center">
      {/* Search input */}
      <div className="relative flex-1 min-w-[220px]">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search for jobs..."
          className="w-full pl-9 pr-3 py-2 border rounded-xl"
        />
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
      </div>

      {/* Filter selects */}
      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="border rounded-xl py-2 px-3 text-gray-500"
      >
        <option value="">Department</option>
        <option value="Engineering">Engineering</option>
        <option value="Marketing">Marketing</option>
        <option value="Sales">Sales</option>
      </select>

      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border rounded-xl py-2 px-3 text-gray-500"
      >
        <option value="">Location</option>
        <option value="Lagos">Lagos</option>
        <option value="Abuja">Abuja</option>
      </select>

      <select
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
        className="border rounded-xl py-2 px-3 text-gray-500"
      >
        <option value="">Owner</option>
        <option value="John Doe">John Doe</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border rounded-xl py-2 px-3 text-gray-500"
      >
        <option value="">Status</option>
        <option value="Published">Published</option>
        <option value="Draft">Draft</option>
        <option value="Deactivated">Deactivated</option>
      </select>

      <select
        value={datePosted}
        onChange={(e) => setDatePosted(e.target.value)}
        className="border rounded-xl py-2 px-3 text-gray-500"
      >
        <option value="">Date Posted</option>
        <option value="24h">Last 24 hours</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
      </select>

      {/* Submit button with arrow */}
      <button
        type="submit"
        className="pill flex items-center font-bold text-blue-900"
      >
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
