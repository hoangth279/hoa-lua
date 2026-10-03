import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_NAME, SITE_URL } from '../lib/seo';

const DEFAULT_DESCRIPTION = 'Họa Lụa là chiến dịch nghệ thuật phi lợi nhuận kết nối lụa, thủ công và văn hóa Việt với đời sống đương đại.';
const DEFAULT_IMAGE = `${SITE_URL}/og.png`;

function Seo({ title, description = DEFAULT_DESCRIPTION, image, type = 'website', noIndex = false }) {
  const { pathname } = useLocation();
  const canonicalUrl = `${SITE_URL}${pathname}`;
  const absoluteImage = image?.startsWith('http') ? image : image ? `${SITE_URL}${image}` : DEFAULT_IMAGE;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Nghệ thuật được sẻ chia`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={absoluteImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
    </Helmet>
  );
}

export default Seo;
