import useSWR from 'swr';
const fetcher = (url) => fetch(url).then(r=>r.json());

export default function useJobs({ status, keyword, page = 1, limit = 6, sort = '-createdAt' } = {}) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (keyword) params.set('keyword', keyword);
  params.set('page', String(page));
  params.set('limit', String(limit));
  params.set('sort', String(sort));

  const { data, error, mutate, isLoading } = useSWR(`/api/jobs?${params.toString()}`, fetcher, {
    revalidateOnFocus: true
  });

  return {
    jobs: data?.jobs || [],
    total: data?.total || 0,
    page: data?.page || page,
    limit: data?.limit || limit,
    loading: isLoading,
    error,
    mutate
  };
}
