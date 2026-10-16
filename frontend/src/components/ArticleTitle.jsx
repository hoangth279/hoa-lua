export default function ArticleTitle({ as: Heading = 'h3', title }) {
  const colonIndex = title.indexOf(':');
  if (colonIndex === -1) return <Heading>{title}</Heading>;

  const lines = [title.slice(0, colonIndex).trim(), title.slice(colonIndex + 1).trim()];

  return (
    <Heading className="workshop-title--split">
      {lines.map((line, index) => <span key={index}>{line}</span>)}
    </Heading>
  );
}
