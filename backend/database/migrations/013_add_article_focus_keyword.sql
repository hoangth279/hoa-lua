USE hoa_lua;

ALTER TABLE articles
  ADD COLUMN focus_keyword VARCHAR(190) NULL AFTER excerpt;

UPDATE articles SET focus_keyword = 'họa lụa tranh thủ công làm từ lụa'
WHERE slug = 'tranh-thu-cong-lam-tu-lua';

UPDATE articles SET focus_keyword = 'họa lụa quà tặng làm từ lụa'
WHERE slug = 'qua-tang-lam-tu-lua';

UPDATE articles SET focus_keyword = 'họa lụa cách làm tranh lụa vụn'
WHERE slug = 'cach-lam-tranh-lua-vun-tai-vun-art';
