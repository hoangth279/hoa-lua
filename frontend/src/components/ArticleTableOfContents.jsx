import { useState } from 'react';

export default function ArticleTableOfContents({ entries }) {
  const [expanded, setExpanded] = useState(false);

  return <nav className={`article-toc${expanded ? ' article-toc--expanded' : ''}`} aria-label="Mục lục bài viết">
    <p>Trong bài viết này</p>
    <button className="article-toc__toggle" type="button" aria-expanded={expanded} aria-controls="article-toc-links" onClick={() => setExpanded((value) => !value)}>
      Trong bài viết này <span aria-hidden="true">{expanded ? '−' : '+'}</span>
    </button>
    <div id="article-toc-links" className="article-toc__panel"><div><ol>{entries.map((entry) => <li key={entry.id}><a href={`#${entry.id}`}>{entry.text}</a></li>)}</ol></div></div>
  </nav>;
}
