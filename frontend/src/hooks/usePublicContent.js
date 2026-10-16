import { useEffect, useState } from 'react';
import api from '../api/axios';

export function usePublicContent(path) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const key = `${path}:${attempt}`;

  useEffect(() => {
    const controller = new AbortController();
    api.get(path, { signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted) setResult({ key, data: data.data, error: '', status: 200 });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setResult({ key, data: null, error: 'Không thể tải nội dung. Vui lòng thử lại.', status: error.response?.status });
      });
    return () => controller.abort();
  }, [path, key]);

  const current = result?.key === key ? result : null;
  return {
    data: current?.data ?? null,
    loading: !current,
    error: current?.error || '',
    status: current?.status,
    retry: () => setAttempt((value) => value + 1),
  };
}
