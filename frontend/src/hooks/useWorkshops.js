import { useEffect, useState } from 'react';
import api from '../api/axios';

export function useWorkshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get('/workshops')
      .then(({ data }) => { if (active) setWorkshops(data.data); })
      .catch(() => { /* Giữ danh sách rỗng khi API chưa sẵn sàng. */ })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return { workshops, loading };
}
