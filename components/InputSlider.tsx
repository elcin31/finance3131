"use client";

export function InputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  formatValue,
  helperText,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
  helperText?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-medium text-ink-600">{label}</label>
        <span className="font-mono text-sm font-semibold text-ink-900">
          {formatValue(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-200 accent-accent"
      />
      {helperText && (
        <p className="mt-1 text-2xs text-ink-400">{helperText}</p>
      )}
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  step = 1,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-ink-600">{label}</label>
      <div className="mt-1 flex items-center rounded-md border border-ink-200 bg-white px-2.5 py-1.5 focus-within:border-accent">
        {prefix && (
          <span className="mr-1 text-xs text-ink-400">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          step={step}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent font-mono text-sm text-ink-900 outline-none"
        />
        {suffix && (
          <span className="ml-1 text-xs text-ink-400">{suffix}</span>
        )}
      </div>
    </div>
  );
}
