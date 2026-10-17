import { useFittedTitle } from '../hooks/useFittedTitle';

export default function WorkshopTitle({ as: Heading = 'h3', title }) {
  const ref = useFittedTitle(title);
  const lines = title.split(/\s*[-–—]\s*/);
  const shouldSplit = lines.length === 2 && (
    /Art Kit$/i.test(lines[0]) || /^Ghép lụa vụn$/i.test(lines[0])
  );

  return (
    <Heading ref={shouldSplit ? ref : undefined} className={shouldSplit ? 'workshop-title--split' : undefined}>
      {shouldSplit ? lines.map((line, index) => (
        <span key={index}>{line}{index === 0 ? ' ' : ''}</span>
      )) : title}
    </Heading>
  );
}
