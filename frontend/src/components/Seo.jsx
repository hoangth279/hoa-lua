import { useEffect } from 'react';

function Seo({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | Họa Lụa` : 'Họa Lụa | Nghệ thuật được sẻ chia';
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute('content', description);
  }, [title, description]);
  return null;
}

export default Seo;
