export default function HomeSkeleton() {
  return (
    <div className="page-skeleton" role="status" aria-label="Loading portfolio">
      <div aria-hidden="true">
        <header className="skeleton-nav">
          <span className="skeleton-block skeleton-logo" />
          <div className="skeleton-nav-links">
            <span className="skeleton-block" />
            <span className="skeleton-block" />
            <span className="skeleton-block" />
          </div>
        </header>

        <main>
          <section className="skeleton-hero">
            <div className="skeleton-copy">
              <span className="skeleton-block skeleton-title" />
              <span className="skeleton-block skeleton-title skeleton-title-short" />
              <span className="skeleton-block skeleton-line skeleton-role" />
              <span className="skeleton-block skeleton-line" />
              <span className="skeleton-block skeleton-line" />
              <span className="skeleton-block skeleton-line skeleton-line-short" />
              <div className="skeleton-actions">
                <span className="skeleton-block" />
                <span className="skeleton-block" />
              </div>
            </div>
            <span className="skeleton-block skeleton-portrait" />
          </section>

          <section className="skeleton-section">
            <span className="skeleton-block skeleton-heading" />
            <span className="skeleton-block skeleton-line" />
            <span className="skeleton-block skeleton-line skeleton-line-short" />
          </section>

          <section className="skeleton-section">
            <span className="skeleton-block skeleton-heading" />
            <div className="skeleton-cards">
              <span className="skeleton-block skeleton-card" />
              <span className="skeleton-block skeleton-card" />
              <span className="skeleton-block skeleton-card" />
            </div>
          </section>
        </main>
      </div>
      <span className="visually-hidden">Loading portfolio content</span>
    </div>
  );
}