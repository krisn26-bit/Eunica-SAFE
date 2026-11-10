"use client";

import { AlertCircle } from "lucide-react";
import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

const controlClasses =
  "w-full min-h-11 border border-rule-strong bg-[color:var(--paper)] px-3 py-2.5 text-[1rem] text-ink rounded-[var(--radius-control)] placeholder:text-ink-muted/70 focus:border-brand";

type FieldShellProps = {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  /** Why this field exists, shown for anything sensitive (spec §9). */
  purpose?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
};

export function FieldShell({
  label,
  htmlFor,
  hint,
  purpose,
  error,
  optional = true,
  children,
}: FieldShellProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="text-ink block text-[0.95rem] font-semibold"
      >
        {label}
        {optional ? (
          <span className="text-ink-muted ml-2 text-[0.78rem] font-normal tracking-wide">
            optional
          </span>
        ) : null}
      </label>
      {purpose ? (
        <p className="text-ink-muted text-[0.85rem]">{purpose}</p>
      ) : null}
      {children}
      {hint ? <p className="text-ink-muted text-[0.85rem]">{hint}</p> : null}
      {error ? (
        <p
          role="alert"
          className="text-emergency-deep flex items-start gap-1.5 text-[0.88rem] font-medium"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
  hint?: ReactNode;
  purpose?: string;
  error?: string;
  optional?: boolean;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, hint, purpose, error, optional, className, id, ...props },
    ref,
  ) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    return (
      <FieldShell
        label={label}
        htmlFor={fieldId}
        hint={hint}
        purpose={purpose}
        error={error}
        optional={optional}
      >
        <input
          id={fieldId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          className={cn(controlClasses, className)}
          {...props}
        />
      </FieldShell>
    );
  },
);

type TextAreaFieldProps = ComponentPropsWithoutRef<"textarea"> & {
  label: string;
  hint?: ReactNode;
  purpose?: string;
  error?: string;
  optional?: boolean;
};

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextAreaFieldProps
>(function TextAreaField(
  { label, hint, purpose, error, optional, className, id, rows = 4, ...props },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <FieldShell
      label={label}
      htmlFor={fieldId}
      hint={hint}
      purpose={purpose}
      error={error}
      optional={optional}
    >
      <textarea
        id={fieldId}
        ref={ref}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(controlClasses, "min-h-24 leading-relaxed", className)}
        {...props}
      />
    </FieldShell>
  );
});

type SelectFieldProps = ComponentPropsWithoutRef<"select"> & {
  label: string;
  hint?: ReactNode;
  purpose?: string;
  error?: string;
  optional?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    {
      label,
      hint,
      purpose,
      error,
      optional,
      options,
      placeholder,
      className,
      id,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    return (
      <FieldShell
        label={label}
        htmlFor={fieldId}
        hint={hint}
        purpose={purpose}
        error={error}
        optional={optional}
      >
        <select
          id={fieldId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          className={cn(controlClasses, className)}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FieldShell>
    );
  },
);

type ChoiceOption = {
  value: string;
  label: string;
  detail?: string;
};

type ChoiceGroupProps = {
  legend: string;
  help?: string;
  name: string;
  options: ChoiceOption[];
  /** Selected values. Single-select groups hold zero or one value. */
  value: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
  /** Value that clears all others, e.g. "none of these". */
  exclusiveValue?: string;
  error?: string;
};

/**
 * One control for both single and multiple choice so questionnaire steps look
 * and behave consistently. Tap targets stay large for one-handed use.
 */
export function ChoiceGroup({
  legend,
  help,
  name,
  options,
  value,
  onChange,
  multiple = false,
  exclusiveValue,
  error,
}: ChoiceGroupProps) {
  function toggle(optionValue: string, checked: boolean) {
    if (!multiple) {
      onChange(checked ? [optionValue] : []);
      return;
    }
    if (exclusiveValue && optionValue === exclusiveValue) {
      onChange(checked ? [exclusiveValue] : []);
      return;
    }
    const withoutExclusive = value.filter((item) => item !== exclusiveValue);
    onChange(
      checked
        ? [...withoutExclusive, optionValue]
        : withoutExclusive.filter((item) => item !== optionValue),
    );
  }

  return (
    <fieldset>
      <legend className="text-ink font-serif text-[length:var(--step-1)] font-semibold">
        {legend}
      </legend>
      {help ? (
        <p className="text-ink-muted mt-1.5 text-[0.9rem]">{help}</p>
      ) : null}
      {multiple ? (
        <p className="text-ink-muted mt-1 text-[0.82rem] tracking-wide">
          Select all that apply
        </p>
      ) : null}
      <div className="mt-4 space-y-2">
        {options.map((option) => {
          const checked = value.includes(option.value);
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-[var(--radius-control)] border px-4 py-3.5",
                "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[color:var(--color-focus)]",
                checked
                  ? "border-brand bg-brand-wash"
                  : "border-rule-strong hover:border-brand bg-[color:var(--paper)]",
              )}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={option.value}
                checked={checked}
                onChange={(event) => toggle(option.value, event.target.checked)}
                className="mt-1 size-5 shrink-0 accent-[color:var(--color-action)]"
              />
              <span>
                <span className="text-ink block font-medium">
                  {option.label}
                </span>
                {option.detail ? (
                  <span className="text-ink-muted mt-0.5 block text-[0.88rem]">
                    {option.detail}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p
          role="alert"
          className="text-emergency-deep mt-3 flex items-start gap-1.5 text-[0.9rem] font-medium"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
