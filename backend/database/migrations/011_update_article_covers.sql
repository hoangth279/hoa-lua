USE hoa_lua;

-- Update only the two supplied covers; preserve article text and step images.
UPDATE articles
SET cover_image = '/articles/tranh-thu-cong-cover.jpg'
WHERE slug = 'tranh-thu-cong-lam-tu-lua';

UPDATE articles
SET cover_image = '/articles/qua-tang-lua-cover.jpg'
WHERE slug = 'qua-tang-lam-tu-lua';
