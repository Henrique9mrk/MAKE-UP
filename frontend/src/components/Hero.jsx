import Button from "./Button";

function Hero({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo
}) {
  return (
    <header className="hero">
      <div className="hero__content">

        <p className="section-eyebrow">
          {eyebrow}
        </p>

        <h2>
          {title}
        </h2>

        <p>
          {description}
        </p>

        {actionLabel && actionTo ? (
          <Button to={actionTo}>
            {actionLabel}
          </Button>
        ) : null}

      </div>
    </header>
  );
}

export default Hero;