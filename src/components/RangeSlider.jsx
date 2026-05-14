import { useCallback, useRef, useEffect } from 'react';

export default function RangeSlider({ label, ariaLabel, value, min, max, onChange }) {
  const inputRef = useRef(null);

  // Update the CSS gradient for the filled track
  useEffect(() => {
    if (inputRef.current) {
      const pct = ((value - min) / (max - min)) * 100;
      inputRef.current.style.background = `linear-gradient(to right, var(--accent) ${pct}%, var(--border) ${pct}%)`;
    }
  }, [value, min, max]);

  const handleChange = useCallback(
    (e) => onChange(Number(e.target.value)),
    [onChange]
  );

  return (
    <div className="slider-group">
      <div className="slider-header">
        <span className="label">{label}</span>
        <span className="slider-value">{value}</span>
      </div>
      <input
        ref={inputRef}
        type="range"
        className="slider-input"
        value={value}
        min={min}
        max={max}
        step={1}
        onChange={handleChange}
        aria-label={ariaLabel || label}
      />
    </div>
  );
}
