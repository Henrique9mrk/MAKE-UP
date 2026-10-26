import SectionHeader from "./SectionHeader";

function PageSection({
  eyebrow,
  title,
  description,
  id,
  children,
  className = "",
}) {
  return (
    <section
      className={`page-section ${className}`.trim()}
      aria-labelledby={id}
      id={id}
    >
      <div className="container">

        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          id={id}
        />

        {children}

      </div>
    </section>
  );
}

export default PageSection;