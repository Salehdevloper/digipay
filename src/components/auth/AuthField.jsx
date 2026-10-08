import "./AuthForm.css";
    
/**
 * Input with a floating label (the label sits inside the field and
 * moves up when the field is focused or filled).
 *
 * Props:
 *   id, label, value, onChange(value), error
 *   inputProps   any extra <input> attribute (type, inputMode, dir, ...)
 */
function AuthField({ id, label, value, onChange, error, inputProps }) {
  const errorId = `${id}-error`;

  return (
    <div
      className={`auth-field ${value ? "auth-field--filled" : ""} ${
        error ? "auth-field--error" : ""
      }`}
    >
      <input
        id={id}
        className="auth-field__control"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />

      <label className="auth-field__label" htmlFor={id}>
        {label}
      </label>

      {error && (
        <p className="auth-field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default AuthField;