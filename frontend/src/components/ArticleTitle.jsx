import { useFittedTitle } from '../hooks/useFittedTitle';

export default function ArticleTitle({ as: Heading = 'h3', title }) {
  const ref = useFittedTitle(title);
  const colonIndex = title.indexOf(':');
  if (colonIndex === -1) return <Heading className="library-card-title">{title}</Heading>;

  const lines = [title.slice(0, colonIndex).trim(), title.slice(colonIndex + 1).trim()];

  return (
    <Heading ref={ref} className="library-card-title">
      {lines.map((line, index) => <span key={index}>{line}{index === 0 ? ' ' : ''}</span>)}
    </Heading>
  );
}
