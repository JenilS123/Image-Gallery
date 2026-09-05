import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useToast } from "../components/Toast";
import InputField from "../components/InputField";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const { setUser } = useContext(UserContext);
  const { showToast } = useToast();

  // Password criteria evaluation matching RegisterPage
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

  const validateEmail = (val) => {
    if (!val || !val.trim()) return "Email address is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) return "Please enter a valid email address";
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

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (serverError) {
      setServerError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (serverError) {
      setServerError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError("");
    setTouched({ email: true, password: true });

    if (errors.email) {
      emailRef.current?.focus();
      return;
    }
    if (errors.password) {
      passwordRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const userDoc = await axios.post("/login", {
        email: email.trim(),
        password,
      });
      setUser(userDoc.data);
      showToast("Welcome back! You are signed in.");
      setRedirect(true);
    } catch (error) {
      console.log("Login Error: ", error);
      const rawMsg = error.response?.data;
      let errorMsg = "Unable to sign in. Check your email and password.";

      if (typeof rawMsg === "string") {
        if (rawMsg === "email not found") {
          errorMsg = "Email address not found. Please check your email or register.";
        } else if (rawMsg === "password not found") {
          errorMsg = "Incorrect password. Please check your password and try again.";
        } else {
          errorMsg = rawMsg;
        }
      } else if (rawMsg?.message) {
        errorMsg = rawMsg.message;
      }

      setServerError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  const isFormEmpty = !email && !password && !serverError && !touched.email && !touched.password;

  return (
    <div className="mt-4 grow flex items-center justify-around py-6">
      <div className="mb-16 w-full max-w-md sm:max-w-lg md:max-w-xl 2xl:max-w-2xl 4k:max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl 2xl:text-5xl 4k:text-6xl text-center mb-2 font-bold text-slate-900">Login</h1>
        <p className="text-center text-slate-500 text-xs sm:text-sm 2xl:text-base 4k:text-xl mb-6">Welcome back! Sign in to access your account</p>

        {serverError && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 text-red-500 mt-0.5">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">{serverError}</p>
            </div>
          </div>
        )}

        <form className="max-w-md mx-auto" onSubmit={handleLogin} noValidate>
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
            touched={touched.email}
            required
            autoComplete="email"
          />

          <div className="relative">
            <InputField
              inputRef={passwordRef}
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur("password")}
              error={errors.password}
              touched={touched.password}
              required
              autoComplete="current-password"
            />
            <div className="flex justify-end -mt-2 mb-4">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Password Strength Meter & Checklist */}
          {password.length > 0 && (
            <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Password Requirements:</span>
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

          <div className="mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="primary w-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition hover:brightness-95 py-3 rounded-2xl font-bold shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>

          <div className="text-center text-slate-500 pt-4 text-sm">
            Don't have an account?{" "}
            <Link className="underline text-slate-900 font-semibold hover:text-primary transition" to={"/register"}>
              Register Now
            </Link>
          </div>
        </form>

        <ForgotPasswordModal
          isOpen={isForgotModalOpen}
          onClose={() => setIsForgotModalOpen(false)}
          initialEmail={email}
          onSuccessEmail={(updatedEmail, newPass) => {
            setEmail(updatedEmail);
            setPassword(newPass);
            showToast("Password updated! You can now log in.", "success");
          }}
        />
      </div>
    </div>
  );
};

export default LoginPage;

