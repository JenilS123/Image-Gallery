import React, { useState, useEffect } from "react";
import axios from "axios";
import InputField from "./InputField";
import { useToast } from "./Toast";

const ForgotPasswordModal = ({ isOpen, onClose, initialEmail = "", onSuccessEmail }) => {
  const [step, setStep] = useState(1); // 1: Send Code, 2: Reset Password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [receivedCode, setReceivedCode] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || "");
      setStep(1);
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
      setErrorMsg("");
      setReceivedCode(null);
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  // Password criteria evaluation
  const passwordCriteria = {
    length: newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(newPassword),
    hasLowercase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[^A-Za-z0-9]/.test(newPassword),
  };

  const metCriteriaCount = Object.values(passwordCriteria).filter(Boolean).length;

  const getPasswordStrength = () => {
    if (!newPassword) return { label: "", color: "bg-slate-200", percent: 0, textClass: "" };
    if (metCriteriaCount <= 2) return { label: "Weak", color: "bg-red-500", percent: 33, textClass: "text-red-500" };
    if (metCriteriaCount <= 4) return { label: "Medium", color: "bg-amber-500", percent: 66, textClass: "text-amber-600" };
    return { label: "Strong", color: "bg-emerald-500", percent: 100, textClass: "text-emerald-600" };
  };

  const passwordStrength = getPasswordStrength();
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const handleSendCode = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/forgot-password", { email: email.trim() });
      const data = response.data;

      setReceivedCode(data.resetCode);
      showToast("Verification code generated successfully!");
      setStep(2);
    } catch (err) {
      console.error("Forgot password error:", err);
      const msg = err.response?.data?.message || err.response?.data || "Could not process request. Please try again.";
      setErrorMsg(typeof msg === "string" ? msg : "No account found with this email address.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!code || code.trim().length !== 6) {
      setErrorMsg("Please enter the 6-digit verification code.");
      return;
    }

    if (metCriteriaCount < 5) {
      setErrorMsg("Please meet all password security requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please check and try again.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/reset-password", {
        email: email.trim(),
        code: code.trim(),
        newPassword,
      });

      showToast(response.data?.message || "Password updated successfully!");
      if (onSuccessEmail) {
        onSuccessEmail(email.trim(), newPassword);
      }
      onClose();
    } catch (err) {
      console.error("Reset password error:", err);
      const msg = err.response?.data?.message || err.response?.data || "Failed to reset password. Please check your verification code.";
      setErrorMsg(typeof msg === "string" ? msg : "Invalid or expired verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 transform transition-all duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {step === 1 ? "Forgot Password" : "Reset Your Password"}
              </h2>
              <p className="text-xs text-slate-500">
                {step === 1 ? "Step 1 of 2: Request Code" : "Step 2 of 2: Create New Password"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
            title="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 text-red-500 mt-0.5">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter the email address associated with your account and we will generate a 6-digit verification code for you to reset your password.
              </p>

              <InputField
                label="Registered Email Address"
                type="email"
                placeholder="your@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg("");
                }}
                required
                autoComplete="email"
              />

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {receivedCode && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
                  <p className="font-semibold text-amber-800 flex items-center gap-1.5">
                    <span>🔑 Verification Code Generated:</span>
                    <span className="font-mono text-base font-bold bg-amber-200/80 px-2 py-0.5 rounded text-slate-900 tracking-wider">
                      {receivedCode}
                    </span>
                  </p>
                  <p className="text-amber-700 mt-1 text-xs">
                    Copy or enter the 6-digit code above to proceed.
                  </p>
                </div>
              )}

              <InputField
                label="Email"
                type="email"
                value={email}
                disabled
              />

              <InputField
                label="6-Digit Verification Code"
                type="text"
                maxLength={6}
                placeholder="e.g. 123456"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setErrorMsg("");
                }}
                required
              />

              <div>
                <div className="relative">
                  <InputField
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrorMsg("");
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {newPassword.length > 0 && (
                  <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
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
                    <div className="pt-1 text-xs space-y-1 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className={passwordCriteria.length ? "text-emerald-500 font-bold" : "text-slate-400"}>
                          {passwordCriteria.length ? "✓" : "•"}
                        </span>
                        <span>8+ characters</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={passwordCriteria.hasUppercase ? "text-emerald-500 font-bold" : "text-slate-400"}>
                          {passwordCriteria.hasUppercase ? "✓" : "•"}
                        </span>
                        <span>Uppercase letter (A-Z)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={passwordCriteria.hasLowercase ? "text-emerald-500 font-bold" : "text-slate-400"}>
                          {passwordCriteria.hasLowercase ? "✓" : "•"}
                        </span>
                        <span>Lowercase letter (a-z)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={passwordCriteria.hasNumber ? "text-emerald-500 font-bold" : "text-slate-400"}>
                          {passwordCriteria.hasNumber ? "✓" : "•"}
                        </span>
                        <span>Number (0-9)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={passwordCriteria.hasSpecial ? "text-emerald-500 font-bold" : "text-slate-400"}>
                          {passwordCriteria.hasSpecial ? "✓" : "•"}
                        </span>
                        <span>Special character (!@#$%^&*)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <InputField
                  label="Confirm New Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrorMsg("");
                  }}
                  required
                />
                {confirmPassword && (
                  <p className={`text-xs mt-1 font-medium ${passwordsMatch ? "text-emerald-600" : "text-red-500"}`}>
                    {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 underline"
                >
                  ← Change Email
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !code.trim() || metCriteriaCount < 5 || !passwordsMatch}
                    className="primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Updating...</span>
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
