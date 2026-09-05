import React, { useState } from "react";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required = false,
  disabled = false,
  minLength,
  maxLength,
  min,
  max,
  step,
  autoComplete,
  id,
  helperText,
  className = "",
  inputRef,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const actualType = isPasswordField ? (showPassword ? "text" : "password") : type;

  const isInvalid = touched && Boolean(error);

  const inputId = id || (name ? `field-${name}` : undefined);

  return (
    <div className={`w-full flex flex-col mb-4 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 text-xs sm:text-sm 2xl:text-base 4k:text-xl font-semibold text-slate-700 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-red-500 font-bold">*</span>}
          </span>
          {maxLength && (
            <span className="text-xs 2xl:text-sm 4k:text-base font-normal text-slate-400">
              {String(value || "").length}/{maxLength}
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type={actualType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border px-3.5 py-2.5 2xl:px-4 2xl:py-3.5 4k:px-6 4k:py-5 text-xs sm:text-sm 2xl:text-base 4k:text-xl outline-none transition duration-150 ${
            isPasswordField ? "pr-10" : ""
          } ${
            isInvalid
              ? "border-red-500 bg-red-50/30 text-slate-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-slate-300 bg-white text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10"
          } ${disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : ""}`}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none transition p-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-5 h-5 2xl:w-6 2xl:h-6 4k:w-8 4k:h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 17.772 17.772M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-5 h-5 2xl:w-6 2xl:h-6 4k:w-8 4k:h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {isInvalid && (
        <p className="mt-1.5 text-xs 2xl:text-sm 4k:text-lg font-medium text-red-600 flex items-center gap-1.5 animate-fadeIn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </p>
      )}

      {!isInvalid && helperText && (
        <p className="mt-1.5 text-xs 2xl:text-sm 4k:text-lg text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export default InputField;
