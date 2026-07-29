// The one signature element of the auth screens: a barometer-style dial
// whose needle sweeps slowly, standing in for "reading the atmosphere" -
// the core idea of the app.
const GaugePanel = ({ eyebrow, title, tagline }) => {
  return (
    <div className="gauge-panel">
      <div className="gauge-panel__content">
        <span className="gauge-panel__eyebrow">{eyebrow}</span>
        <h1 className="gauge-panel__title">{title}</h1>
        <p className="gauge-panel__tagline">{tagline}</p>
      </div>

      <svg
        className="gauge-panel__dial"
        viewBox="0 0 240 240"
        role="img"
        aria-label="Animated barometer dial"
      >
        <circle cx="120" cy="120" r="110" className="gauge-ring-outer" />
        <circle cx="120" cy="120" r="86" className="gauge-ring-inner" />
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * 360;
          const isMajor = i % 6 === 0;
          return (
            <line
              key={i}
              x1="120"
              y1={isMajor ? "20" : "26"}
              x2="120"
              y2="34"
              className={isMajor ? "gauge-tick gauge-tick--major" : "gauge-tick"}
              transform={`rotate(${angle} 120 120)`}
            />
          );
        })}
        <g className="gauge-needle">
          <line x1="120" y1="120" x2="120" y2="46" className="gauge-needle__line" />
          <circle cx="120" cy="120" r="7" className="gauge-needle__hub" />
        </g>
      </svg>
    </div>
  );
};

export default GaugePanel;
