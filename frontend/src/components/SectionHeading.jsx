function SectionHeading({ index, eyebrow, title, action }) {
  return (
    <div className="section-heading">
      <p className="section-index">{index} / {eyebrow}</p>
      <h2>{title}</h2>
      {action}
    </div>
  );
}
export default SectionHeading;
