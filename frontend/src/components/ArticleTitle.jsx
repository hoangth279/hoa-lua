export default function ArticleTitle({ as: Heading = 'h3', title }) {
  const colonIndex = title.indexOf(':');
  if (colonIndex === -1) return <Heading className="library-card-title">{title}</Heading>;

  const mainTitle = title.slice(0, colonIndex).trim();
  const subtitle = title.slice(colonIndex + 1).trim();

  return (
    <Heading className="library-card-title">
      <span>{mainTitle}</span>
      {subtitle && <><span className="sr-only">: </span><span className="library-card-title__subtitle">{subtitle}</span></>}
    </Heading>
  );
}
