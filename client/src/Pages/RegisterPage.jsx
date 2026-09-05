import React, { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../components/Toast";
import InputField from "../components/InputField";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const [duplicateEmailError, setDuplicateEmailError] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const { showToast } = useToast();

  // Password criteria evaluation
  const passwordCriteria = {
    length: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const metCriteriaCount = Object.values(passwordCriteria).filter(Boolean).length;

  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "bg-slate-200", percent: 0, textClass: "" };
    if (metCriteriaCount <= 2) return { label: "Weak", color: "bg-red-500", percent: 33, textClass: "text-red-500" };
    if (metCriteriaCount <= 4) return { label: "Medium", color: "bg-amber-500", percent: 66, textClass: "text-amber-600" };
    return { label: "Strong", color: "bg-emerald-500", percent: 100, textClass: "text-emerald-600" };
  };

  const passwordStrength = getPasswordStrength();

  const validateName = (val) => {
    if (!val || !val.trim()) return "Full name is required";
    if (val.trim().length < 2) return "Name must be at least 2 characters";
    if (val.trim().length > 60) return "Name cannot exceed 60 characters";
    if (!/^[a-zA-Z\s'-]+$/.test(val.trim())) return "Name should only contain letters and spaces";
    return "";
  };

  const validateEmail = (val) => {
    if (!val || !val.trim()) return "Email address is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) return "Please enter a valid email address";
    if (duplicateEmailError) return duplicateEmailError;
    return "";
  };

  const validatePassword = (val) => {
    if (!val) return "Password is required";
    if (val.length < 8) return "Password must be at least 8 characters";
    if (!passwordCriteria.hasUppercase) return "Password must include an uppercase letter";
    if (!passwordCriteria.hasLowercase) return "Password must include a lowercase letter";
    if (!passwordCriteria.hasNumber) return "Password must include a number";
    if (!passwordCriteria.hasSpecial) return "Password must include a special character (!@#$%^&*)";
    return "";
  };

  const validateConfirmPassword = (val) => {
    if (!val) return "Please confirm your password";
    if (val !== password) return "Passwords do not match";
    return "";
  };

  const errors = {
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(confirmPassword),
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (duplicateEmailError) {
      setDuplicateEmailError("");
    }
    if (serverError) {
      setServerError("");
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setTouched({
      name: false,
      email: false,
      password: false,
      confirmPassword: false,
    });
    setServerError("");
    setDuplicateEmailError("");
    showToast("Form has been reset.", "info");
    nameRef.current?.focus();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setServerError("");
    setDuplicateEmailError("");

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (errors.name) {
      nameRef.current?.focus();
      return;
    }
    if (errors.email) {
      emailRef.current?.focus();
      return;
    }
    if (errors.password) {
      passwordRef.current?.focus();
      return;
    }
    if (errors.confirmPassword) {
      confirmPasswordRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post("/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });
      showToast("Registration successful! Please sign in.");
      setRedirect(true);
    } catch (error) {
      console.log("Client register error: ", error);
      const message = error.response?.data?.error || error.response?.data?.message || "Registration failed. Please try again.";

      if (
        message.toLowerCase().includes("already registered") ||
        message.toLowerCase().includes("already exits") ||
        message.toLowerCase().includes("already exists")
      ) {
        const dupeMsg = "This email is already registered. Please sign in instead.";
        setDuplicateEmailError(dupeMsg);
        setServerError(dupeMsg);
        emailRef.current?.focus();
        showToast(dupeMsg, "error");
      } else {
        setServerError(message);
        showToast(message, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  const isFormEmpty = !name && !email && !password && !confirmPassword && !serverError && !duplicateEmailError && !touched.name && !touched.email && !touched.password && !touched.confirmPassword;

  return (
    <div className="mt-4 grow flex items-center justify-around py-6">
      <div className="mb-16 w-full max-w-md sm:max-w-lg md:max-w-xl 2xl:max-w-2xl 4k:max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl 2xl:text-5xl 4k:text-6xl text-center mb-2 font-bold text-slate-900">Create Account</h1>
        <p className="text-center text-slate-500 text-xs sm:text-sm 2xl:text-base 4k:text-xl mb-6">Join us today to book your next stay</p>

        {serverError && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 text-red-500 mt-0.5">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">{serverError}</p>
              {duplicateEmailError && (
                <Link to="/login" className="inline-block mt-1.5 text-xs font-semibold text-primary underline hover:text-red-800">
                  Click here to Login
                </Link>
              )}
            </div>
          </div>
        )}

        <form className="max-w-md mx-auto" onSubmit={handleRegister} noValidate>
          <InputField
            inputRef={nameRef}
            label="Full Name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleBlur("name")}
            error={errors.name}
            touched={touched.name}
            required
            maxLength={60}
            autoComplete="name"
          />

          <InputField
            inputRef={emailRef}
            label="Email Address"
            type="email"
            name="email"
            placeholder="your@gmail.com"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => handleBlur("email")}
            error={errors.email}
            touched={touched.email || Boolean(duplicateEmailError)}
            required
            autoComplete="email"
          />

          <InputField
            inputRef={passwordRef}
            label="Password"
            type="password"
            name="password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            error={errors.password}
            touched={touched.password}
            required
            autoComplete="new-password"
          />

          {/* Password Strength Meter & Checklist */}
          {password.length > 0 && (
            <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Password Strength:</span>
                <span className={passwordStrength.textClass}>{passwordStrength.label}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.percent}%` }}
                ></div>
              </div>

              <div className="pt-1 text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center gap-2">
                  {passwordCriteria.length ? (
                    <span className="text-emerald-500 font-bold">✓</span>
                  ) : (
                    <span className="text-slate-400 font-bold">•</span>
                  )}
                  <span className={passwordCriteria.length ? "text-slate-800 font-medium" : "text-slate-500"}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordCriteria.hasUppercase ? (
                    <span className="text-emerald-500 font-bold">✓</span>
                  ) : (
                    <span className="text-slate-400 font-bold">•</span>
                  )}
                  <span className={passwordCriteria.hasUppercase ? "text-slate-800 font-medium" : "text-slate-500"}>
                    At least one uppercase letter (A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordCriteria.hasLowercase ? (
                    <span className="text-emerald-500 font-bold">✓</span>
                  ) : (
                    <span className="text-slate-400 font-bold">•</span>
                  )}
                  <span className={passwordCriteria.hasLowercase ? "text-slate-800 font-medium" : "text-slate-500"}>
                    At least one lowercase letter (a-z)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordCriteria.hasNumber ? (
                    <span className="text-emerald-500 font-bold">✓</span>
                  ) : (
                    <span className="text-slate-400 font-bold">•</span>
                  )}
                  <span className={passwordCriteria.hasNumber ? "text-slate-800 font-medium" : "text-slate-500"}>
                    At least one number (0-9)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordCriteria.hasSpecial ? (
                    <span className="text-emerald-500 font-bold">✓</span>
                  ) : (
                    <span className="text-slate-400 font-bold">•</span>
                  )}
                  <span className={passwordCriteria.hasSpecial ? "text-slate-800 font-medium" : "text-slate-500"}>
                    At least one special character (!@#$%^&*)
                  </span>
                </div>
              </div>
            </div>
          )}

          <InputField
            inputRef={confirmPasswordRef}
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
            required
            autoComplete="new-password"
          />

          <div className="flex items-center gap-3 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="primary flex-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition hover:brightness-95 py-2.5 rounded-2xl"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                "Register"
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting || isFormEmpty}
              className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 active:bg-slate-200 font-semibold py-2.5 px-4 rounded-2xl flex items-center justify-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              title="Reset form fields"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>Reset</span>
            </button>
          </div>

          <div className="text-center text-slate-500 pt-4 text-sm">
            Already have an account?{" "}
            <Link className="underline text-slate-900 font-semibold hover:text-primary transition" to="/login">
              Login Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
