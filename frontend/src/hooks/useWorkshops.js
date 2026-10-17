import { useEffect, useState } from 'react';
import api from '../api/axios';
import silkWorkshopImage from '../assets/workshop-silk-collage.jpg';
import artKitImage from '../assets/workshop-art-kit.jpg';

export function useWorkshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get('/workshops')
      .then(({ data }) => {
        if (active) setWorkshops(data.data.map((workshop) => ({
          ...workshop,
          coverImage: workshop.coverImage || (/art[\s-]*kit/i.test(`${workshop.slug} ${workshop.title}`) ? artKitImage : silkWorkshopImage),
        })));
      })
      .catch(() => { /* Giữ danh sách rỗng khi API chưa sẵn sàng. */ })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return { workshops, loading };
}
