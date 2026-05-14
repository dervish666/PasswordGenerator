export default function RequirementsToggles({ requirements, onChange }) {
  const toggles = [
    { key: 'capital', label: 'Capital letter' },
    { key: 'number', label: 'Number' },
    { key: 'special', label: 'Special char' },
  ];

  return (
    <div className="requirements-group">
      <span className="label">Requirements</span>
      <div className="toggles-row">
        {toggles.map(({ key, label }) => (
          <label key={key} className="toggle-label">
            <input
              type="checkbox"
              className="toggle-input"
              checked={requirements[key]}
              onChange={() => onChange(key)}
              aria-label={`Require ${label}`}
            />
            <span className="toggle-switch" />
            <span className="toggle-text">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
