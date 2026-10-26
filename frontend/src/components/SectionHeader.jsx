function SectionHeader({ eyebrow, title, description, id }) {
  return (
    <header className="section-header">
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <h1 id={id}>{title}</h1>
      {description ? <p className="section-description">{description}</p> : null}
    </header>
  );
}

export default SectionHeader;
