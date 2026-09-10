"use client";

import { useId, useState, type ReactNode } from "react";

import { Input, Label, Select, Textarea } from "@/shared/ui";

export function PropertiesSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 border-t border-stone-200 pt-4 first:border-t-0 first:pt-0">
      <h4 className="text-xs font-black text-stone-500">{title}</h4>
      {children}
    </section>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const id = useId();
  const formatNumber = (val: number) =>
    Number.isInteger(val) ? String(val) : String(Number(val.toFixed(2)));

  const [draft, setDraft] = useState<string>(formatNumber(value));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  if (!isFocused && value !== prevValue) {
    setPrevValue(value);
    setDraft(formatNumber(value));
    setErrorMessage(null);
  }

  function validate(text: string): { valid: boolean; value?: number; error?: string } {
    const trimmed = text.trim();
    if (trimmed === "" || trimmed === "-" || trimmed === "+") {
      return { valid: false, error: "الحقل مطلوب." };
    }
    const num = Number(trimmed);
    if (!Number.isFinite(num)) {
      return { valid: false, error: "أدخل رقماً صالحاً." };
    }
    if (min !== undefined && num < min) {
      return { valid: false, error: `الحد الأدنى ${min}` };
    }
    if (max !== undefined && num > max) {
      return { valid: false, error: `الحد الأقصى ${max}` };
    }
    return { valid: true, value: num };
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextDraft = event.target.value;
    setDraft(nextDraft);

    if (nextDraft === "" || nextDraft === "-" || nextDraft === "+") {
      setErrorMessage(null);
      return;
    }

    const check = validate(nextDraft);
    if (!check.valid) {
      setErrorMessage(check.error ?? "قيمة غير صالحة.");
    } else {
      setErrorMessage(null);
      onChange(check.value!);
    }
  }

  function handleBlur() {
    setIsFocused(false);
    const check = validate(draft);
    if (check.valid && check.value !== undefined) {
      setErrorMessage(null);
      setDraft(formatNumber(check.value));
      onChange(check.value);
    } else {
      setDraft(formatNumber(value));
      setErrorMessage(null);
    }
  }

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        value={draft}
        min={min}
        max={max}
        step={step}
        dir="ltr"
        onFocus={() => setIsFocused(true)}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
          if (event.key === "Escape") {
            setDraft(formatNumber(value));
            setErrorMessage(null);
            event.currentTarget.blur();
          }
        }}
        aria-invalid={errorMessage !== null}
      />
      {errorMessage ? (
        <p role="alert" className="mt-1 text-xs font-semibold text-red-600">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  dir,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        dir={dir}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  dir,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
  className?: string;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        dir={dir}
        className={className}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </Select>
    </div>
  );
}

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const pickerId = useId();
  const textId = useId();

  function commit(input: HTMLInputElement) {
    const draft = input.value.trim();
    if (/^#[0-9a-f]{6}$/i.test(draft)) onChange(draft);
    else input.value = value;
  }

  return (
    <div>
      <Label htmlFor={textId}>{label}</Label>
      <div className="flex gap-2" dir="ltr">
        <Input
          id={pickerId}
          type="color"
          aria-label={`${label} — منتقي اللون`}
          className="w-12 shrink-0 px-1.5"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <Input
          key={value}
          id={textId}
          defaultValue={value}
          maxLength={7}
          spellCheck={false}
          onBlur={(event) => commit(event.currentTarget)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
            if (event.key === "Escape") event.currentTarget.value = value;
          }}
        />
      </div>
    </div>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-brand-border bg-surface-strong px-3 py-2.5 text-xs font-semibold text-stone-700"
    >
      <span>{label}</span>
      <input
        id={id}
        type="checkbox"
        className="size-4 accent-primary"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
