import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import logo from "../assets/ebench_logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useAdminResetPasswordMutation, useResetPasswordMutation } from "../redux/services/authApi";

/* ── Password strength calculator ── */
function getStrength(password) {
  if (!password) return { score: 0, label: "", color: "#E2EDF8" };
  let score = 0;
  if (password.length >= 6)           score++;
  if (password.length >= 10)          score++;
  if (/[A-Z]/.test(password))         score++;
  if (/[0-9]/.test(password))         score++;
  if (/[^A-Za-z0-9]/.test(password))  score++;
  const levels = [
    { label: "",            color: "#E2EDF8" },
    { label: "Weak",        color: "#EF4444" },
    { label: "Fair",        color: "#F97316" },
    { label: "Good",        color: "#EAB308" },
    { label: "Strong",      color: "#22C55E" },
    { label: "Very Strong", color: "#16A34A" },
  ];
  return { score, ...levels[score] };
}

const ResetPassword = () => {
  const navigate    = useNavigate();
  const location    = useLocation();
  const email       = new URLSearchParams(location.search).get("email");
  const isAdmin     = location.pathname.includes("admin");

  const [resetPassword,      { isLoading }]               = useResetPasswordMutation();
  const [adminResetPassword, { isLoading: adminLoading }] = useAdminResetPasswordMutation();

  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const newPassword = watch("newPassword", "");
  const confirmVal  = watch("confirmPassword", "");
  const strength    = getStrength(newPassword);
  const isBusy      = isLoading || adminLoading;

  /* ── Vendor submit ── */
  const onVendorSubmit = async ({ newPassword, confirmPassword }) => {
    const data = {
      email:            location?.state?.email,
      new_password:     newPassword,
      confirm_password: confirmPassword,
      reset_token:      location?.state?.reset_token,
    };
    try {
      await resetPassword(data).unwrap();
      setTimeout(() => {
        toast.success("Password reset successfully!");
        navigate("/");
      }, 1000);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  /* ── Admin submit ── */
  const onAdminSubmit = async ({ newPassword, confirmPassword }) => {
    if (!email) return toast.error("Email is required!");
    const data = {
      email,
      new_password:     newPassword,
      confirm_password: confirmPassword,
    };
    try {
      await adminResetPassword(data).unwrap();
      setTimeout(() => {
        toast.success("Password reset successfully!");
        navigate("/admin-login");
      }, 1000);
    } catch (error) {
      toast.error(error?.data?.detail || "Something went wrong!");
    }
  };

  /* ── Shared input style ── */
  const inputStyle = (hasError, hasValue) => ({
    width: "100%",
    padding: "12px 44px 12px 40px",
    borderRadius: 12,
    border: `1.5px solid ${hasError ? "#FCA5A5" : hasValue && !hasError ? "#86EFAC" : "#D9E9F8"}`,
    fontSize: 15,
    color: "#0F2744",
    outline: "none",
    boxSizing: "border-box",
    background: "#FAFCFF",
    fontFamily: "inherit",
    transition: "border-color 0.2s, box-shadow 0.2s",
  });

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: "linear-gradient(160deg, #F0F7FF, #EBF4FD)",
    }}>
      {/* <Header /> */}

      {/* Centered card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            maxWidth: 460,
            width: "100%",
            background: "white",
            borderRadius: 24,
            padding: "40px 36px",
            boxShadow: "0 24px 80px rgba(43,127,255,0.13), 0 4px 16px rgba(0,0,0,0.05)",
            border: "1px solid #E2EDF8",
          }}
        >
         
          {/* Icon */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "linear-gradient(135deg, #EAF3FF, #F0FAFF)",
              border: "1px solid #C3DCFF",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
                <path
                  d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"
                  stroke="#2B7FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F2744", textAlign: "center", marginBottom: 8, letterSpacing: "-0.4px" }}>
            Set New Password
          </h2>
          <p style={{ fontSize: 14, color: "#6B84A0", textAlign: "center", marginBottom: 28, lineHeight: 1.65 }}>
            Your new password must be at least 6 characters and meet the strength requirements below.
          </p>

          <form
            onSubmit={handleSubmit(isAdmin ? onAdminSubmit : onVendorSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
            noValidate
          >
            {/* ── New Password ── */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#3A5068", display: "block", marginBottom: 7 }}>
                New Password
              </label>
              <div style={{ position: "relative" }}>
                {/* Lock icon */}
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#6B84A0" strokeWidth="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="#6B84A0" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>

                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Create a strong password"
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: { value: 6, message: "Must be at least 6 characters" },
                    validate: {
                      hasUpper:  v => /[A-Z]/.test(v) || "Add at least one uppercase letter",
                      hasNumber: v => /[0-9]/.test(v) || "Add at least one number",
                    },
                  })}
                  style={inputStyle(!!errors.newPassword, !!newPassword)}
                  onFocus={e => { e.target.style.borderColor = "#2B7FFF"; e.target.style.boxShadow = "0 0 0 3px rgba(43,127,255,0.1)"; }}
                  onBlur={e => { e.target.style.boxShadow = "none"; e.target.style.borderColor = errors.newPassword ? "#FCA5A5" : newPassword ? "#86EFAC" : "#D9E9F8"; }}
                />

                {/* Eye toggle */}
                <button
                  type="button"
                  onClick={() => setShowNew(p => !p)}
                  style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6B84A0", display: "flex", alignItems: "center" }}
                >
                  {showNew
                    ? <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    : <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" /></svg>
                  }
                </button>
              </div>

              {/* Strength meter */}
              {newPassword && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 4, borderRadius: 999,
                        background: i <= strength.score ? strength.color : "#E2EDF8",
                        transition: "background 0.3s",
                      }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {strength.label && (
                      <span style={{ fontSize: 12, fontWeight: 600, color: strength.color }}>{strength.label}</span>
                    )}
                    <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
                      {[
                        { ok: newPassword.length >= 6,           label: "6+ chars" },
                        { ok: /[A-Z]/.test(newPassword),         label: "Uppercase" },
                        { ok: /[0-9]/.test(newPassword),         label: "Number" },
                        { ok: /[^A-Za-z0-9]/.test(newPassword),  label: "Symbol" },
                      ].map(({ ok, label }) => (
                        <span key={label} style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 3, color: ok ? "#16A34A" : "#94B8D8" }}>
                          <span style={{ fontWeight: 700 }}>{ok ? "✓" : "·"}</span> {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {errors.newPassword && (
                <p style={{ fontSize: 12, color: "#EF4444", marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" /><path d="M12 8v4m0 4h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" /></svg>
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* ── Confirm Password ── */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#3A5068", display: "block", marginBottom: 7 }}>
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                {/* Shield icon */}
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      stroke="#6B84A0" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your new password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: v => v === newPassword || "Passwords do not match",
                  })}
                  style={inputStyle(!!errors.confirmPassword, !!confirmVal)}
                  onFocus={e => { e.target.style.borderColor = "#2B7FFF"; e.target.style.boxShadow = "0 0 0 3px rgba(43,127,255,0.1)"; }}
                  onBlur={e => { e.target.style.boxShadow = "none"; }}
                />

                {/* Eye toggle */}
                <button
                  type="button"
                  onClick={() => setShowConfirm(p => !p)}
                  style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6B84A0", display: "flex", alignItems: "center" }}
                >
                  {showConfirm
                    ? <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    : <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" /></svg>
                  }
                </button>
              </div>

              {/* Match feedback */}
              {confirmVal && !errors.confirmPassword && (
                <p style={{ fontSize: 12, color: "#16A34A", marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Passwords match
                </p>
              )}
              {errors.confirmPassword && (
                <p style={{ fontSize: 12, color: "#EF4444", marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" /><path d="M12 8v4m0 4h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" /></svg>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* ── Submit button ── */}
            <button
              type="submit"
              disabled={isBusy || !isValid}
              style={{
                width: "100%", padding: "13px 0",
                background: isValid && !isBusy
                  ? "linear-gradient(135deg, #2B7FFF, #0FA8E0)"
                  : "linear-gradient(135deg, #B8D4FF, #A5D8F0)",
                border: "none",
                cursor: isValid && !isBusy ? "pointer" : "not-allowed",
                color: "white", fontSize: 15, fontWeight: 700, borderRadius: 12,
                boxShadow: isValid && !isBusy ? "0 6px 24px rgba(43,127,255,0.4)" : "none",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: "inherit",
              }}
              onMouseEnter={e => {
                if (isValid && !isBusy) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(43,127,255,0.5)";
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = isValid && !isBusy ? "0 6px 24px rgba(43,127,255,0.4)" : "none";
              }}
            >
              {isBusy ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                      stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: "#E2EDF8" }} />
              <span style={{ fontSize: 12, color: "#94B8D8" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "#E2EDF8" }} />
            </div>

            {/* Back to login */}
            <p style={{ textAlign: "center", fontSize: 14, color: "#6B84A0", margin: 0 }}>
              Remembered your password?{" "}
              <span
                onClick={() => navigate("/")}
                style={{ color: "#2B7FFF", fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }}
                onMouseEnter={e => e.target.style.opacity = "0.75"}
                onMouseLeave={e => e.target.style.opacity = "1"}
              >
                Back to Login
              </span>
            </p>
          </form>

          {/* Trust badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 24 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#6B84A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 12, color: "#6B84A0" }}>256-bit encrypted · Your data is safe with us</span>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
};

export default ResetPassword;