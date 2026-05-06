import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../config/api.js";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [focused, setFocused] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    setStatus("sending");
    
    try {
      const response = await fetch(API_ENDPOINTS.CONTACT_US, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error('Error sending contact form:', error);
      setStatus("error");
    }
  };

  return (
    <div
      className="min-h-screen"
      id="contact-section"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "linear-gradient(135deg, #e0f2fe 0%, #f0f7ff 40%, #eff6ff 100%)",
      }}
    >
      {/* Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* ── Page Header ── */}
        <div
          className="mb-14"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.55s ease",
          }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest"
            style={{
              background: "rgba(56,189,248,0.12)",
              border: "1px solid rgba(56,189,248,0.35)",
              color: "#0369a1",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#38bdf8", boxShadow: "0 0 8px rgba(56,189,248,0.7)" }}
            />
            We're available
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h1
              className="text-5xl lg:text-6xl font-extrabold leading-tight"
              style={{ color: "#0f2848", letterSpacing: "-0.03em" }}
            >
              Get in touch<br />
              with{" "}
              <em className="font-light not-italic" style={{ color: "#38bdf8" }}>
                our team
              </em>
            </h1>

            <div className="max-w-xs">
              <div
                className="w-10 h-1 rounded-full mb-3"
                style={{ background: "linear-gradient(90deg, #38bdf8, #1d4ed8)" }}
              />
              <p className="text-base font-light leading-relaxed" style={{ color: "#64748b" }}>
                We're here to help and answer any question you might have. We look forward to hearing from you.
              </p>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── Left: Info cards ── */}
          <div
            className="lg:col-span-2 flex flex-col gap-4"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.55s ease 0.1s",
            }}
          >
            {/* Contact info cards */}
            {[
              { icon: "✉️", label: "Email", val: "info@shilshatech.com", sub: "Reply within 24 hours" },
              { icon: "📞", label: "Phone", val: "+91 9266300673", sub: "Mon–Fri, 9am–6pm" },
              { icon: "📍", label: "Location", val: "H-15, Sector 63, Noida, India", sub: "Available globally" },
              { icon: "🕐", label: "Hours", val: "Mon – Fri", sub: "9:00 AM – 6:00 PM IST" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 p-5 rounded-2xl cursor-default"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(147,197,253,0.35)",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(5px)";
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(56,189,248,0.1)";
                  e.currentTarget.style.borderColor = "rgba(56,189,248,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.8)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(147,197,253,0.35)";
                }}
              >
                <div
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl text-xl"
                  style={{ background: "linear-gradient(135deg, #e0f2fe, #bfdbfe)" }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "#94a3b8" }}>
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "#1e3a5f" }}>{item.val}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{item.sub}</p>
                </div>
              </div>
            ))}

            {/* Quote card */}
            <div
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)",
                border: "1px solid rgba(147,197,253,0.4)",
              }}
            >
              {/* Grid bg */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg,#1d4ed8 0,#1d4ed8 1px,transparent 1px,transparent 40px), repeating-linear-gradient(90deg,#1d4ed8 0,#1d4ed8 1px,transparent 1px,transparent 40px)",
                }}
              />
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#0369a1" }}>
                  Our promise
                </p>
                <p className="text-sm font-medium italic leading-relaxed" style={{ color: "#1e40af" }}>
                  "Every message is read by a real person — no bots, no templates, just genuine replies."
                </p>
                <p className="text-xs font-semibold mt-3" style={{ color: "#0369a1" }}>
                  — The Support Team
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div
            className="lg:col-span-3 rounded-3xl p-10"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(147,197,253,0.3)",
              boxShadow: "0 20px 60px rgba(56,189,248,0.08), 0 4px 16px rgba(29,78,216,0.06)",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.55s ease 0.2s",
            }}
          >
            {status === "success" ? (
              /* ── Success ── */
              <div className="text-center py-8">
                <div
                  className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full text-4xl"
                  style={{
                    background: "linear-gradient(135deg, #e0f2fe, #dbeafe)",
                    border: "2px solid rgba(56,189,248,0.4)",
                  }}
                >
                  ✓
                </div>
                <h3
                  className="text-3xl font-extrabold mb-3"
                  style={{ color: "#0f2848", letterSpacing: "-0.025em" }}
                >
                  Message Sent!
                </h3>
                <p className="text-base font-light leading-relaxed mb-8 mx-auto max-w-xs" style={{ color: "#64748b" }}>
                  Thanks for reaching out. We'll get back to you within one business day.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "#f0f7ff",
                    border: "1.5px solid #bfdbfe",
                    color: "#1d4ed8",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#dbeafe";
                    e.currentTarget.style.borderColor = "#93c5fd";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f0f7ff";
                    e.currentTarget.style.borderColor = "#bfdbfe";
                  }}
                >
                  ← Send another message
                </button>
              </div>
            ) : status === "error" ? (
              /* ── Error ── */
              <div className="text-center py-8">
                <div
                  className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full text-4xl"
                  style={{
                    background: "linear-gradient(135deg, #fee2e2, #fecaca)",
                    border: "2px solid rgba(239,68,68,0.4)",
                  }}
                >
                  ✕
                </div>
                <h3
                  className="text-3xl font-extrabold mb-3"
                  style={{ color: "#0f2848", letterSpacing: "-0.025em" }}
                >
                  Something went wrong
                </h3>
                <p className="text-base font-light leading-relaxed mb-8 mx-auto max-w-xs" style={{ color: "#64748b" }}>
                  We couldn't send your message. Please try again later or contact us directly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "#fef2f2",
                    border: "1.5px solid #fca5a5",
                    color: "#dc2626",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fee2e2";
                    e.currentTarget.style.borderColor = "#f87171";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fef2f2";
                    e.currentTarget.style.borderColor = "#fca5a5";
                  }}
                >
                  ← Try again
                </button>
              </div>
            ) : (
              <>
                {/* Form header */}
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#38bdf8" }}>
                    Direct message
                  </p>
                  <h2
                    className="text-2xl font-extrabold mb-1"
                    style={{ color: "#0f2848", letterSpacing: "-0.025em" }}
                  >
                    Send us a message
                  </h2>
                  <p className="text-sm font-light leading-relaxed" style={{ color: "#94a3b8" }}>
                    Fill in the details below and we'll be in touch shortly.
                  </p>
                </div>

                {/* Progress bar */}
                <div className="flex gap-1.5 mb-9">
                  {[form.name, form.email, form.message].map((v, i) => (
                    <div
                      key={i}
                      className="h-0.5 rounded-full transition-all duration-300"
                      style={{
                        width: i === 0 ? 48 : 24,
                        background: v.trim()
                          ? "linear-gradient(90deg, #38bdf8, #1d4ed8)"
                          : "#e2e8f0",
                      }}
                    />
                  ))}
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <InputField
                      label="Full Name"
                      name="name"
                      type="text"
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={handleChange}
                      error={errors.name}
                      focused={focused}
                      setFocused={setFocused}
                    />
                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={handleChange}
                      error={errors.email}
                      focused={focused}
                      setFocused={setFocused}
                    />
                  </div>

                  {/* Message */}
                  <div className="mb-2">
                    <label
                      className="block text-xs font-bold uppercase tracking-widest mb-2"
                      style={{ color: focused === "message" ? "#1d4ed8" : errors.message ? "#ef4444" : "#64748b" }}
                    >
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Tell us how we can help…"
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      className="w-full resize-none rounded-xl text-sm outline-none transition-all"
                      style={{
                        padding: "13px 16px",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "15px",
                        fontWeight: 400,
                        color: "#0f2848",
                        background: errors.message ? "#fff5f5" : "#f8faff",
                        border: focused === "message"
                          ? "1.5px solid #38bdf8"
                          : errors.message
                          ? "1.5px solid #fca5a5"
                          : "1.5px solid #e2e8f0",
                        boxShadow: focused === "message" ? "0 0 0 4px rgba(56,189,248,0.12)" : "none",
                      }}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs font-medium" style={{ color: "#ef4444" }}>
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="flex items-center gap-5 mt-8">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="inline-flex items-center gap-2 rounded-xl text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      style={{
                        padding: "14px 32px",
                        background: "linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)",
                        boxShadow: "0 6px 24px rgba(29,78,216,0.25)",
                      }}
                      onMouseEnter={(e) => {
                        if (status !== "sending") {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 12px 36px rgba(29,78,216,0.35)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 6px 24px rgba(29,78,216,0.25)";
                      }}
                    >
                      {status === "sending" ? (
                        <>
                          <span
                            className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                          />
                          Sending…
                        </>
                      ) : (
                        <>Send Message <span style={{ fontSize: 17 }}>→</span></>
                      )}
                    </button>
                    <p className="text-xs font-normal leading-relaxed" style={{ color: "#94a3b8" }}>
                      No spam, ever.<br />We respect your privacy.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, type, placeholder, value, onChange, error, focused, setFocused }) {
  const isFocused = focused === name;
  return (
    <div>
      <label
        className="block text-xs font-bold uppercase tracking-widest mb-2"
        style={{
          color: isFocused ? "#1d4ed8" : error ? "#ef4444" : "#64748b",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(name)}
        onBlur={() => setFocused(null)}
        autoComplete="off"
        className="w-full rounded-xl outline-none transition-all"
        style={{
          padding: "13px 16px",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "15px",
          fontWeight: 400,
          color: "#0f2848",
          background: error ? "#fff5f5" : "#f8faff",
          border: isFocused
            ? "1.5px solid #38bdf8"
            : error
            ? "1.5px solid #fca5a5"
            : "1.5px solid #e2e8f0",
          boxShadow: isFocused ? "0 0 0 4px rgba(56,189,248,0.12)" : "none",
        }}
      />
      {error && (
        <p className="mt-1.5 text-xs font-medium" style={{ color: "#ef4444" }}>
          {error}
        </p>
      )}
    </div>
  );
}