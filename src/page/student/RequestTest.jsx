import { useState } from "react";

// Icons (inline SVG)
const Icon = ({ name, cls = "w-5 h-5" }) => {
  const icons = {
    test: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
    credits: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    warning: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>,
    email: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
    close: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
    plus: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>,
    gift: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12v10H4V12M2 7h20v5H2zM12 22V7m0-5a2.5 2.5 0 00-2.5 2.5c0 1.38 1.12 2.5 2.5 2.5m0-5a2.5 2.5 0 012.5 2.5C14.5 8.88 13.38 10 12 10"/></svg>,
    copy: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  };
  return icons[name] || null;
};

// Card component
function Card({ children, className = "" }) {
  return <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>{children}</div>;
}

// Form Input component
function FormInput({ label, type = "text", value, onChange, disabled, children, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === "select" ? (
        <select value={value} onChange={onChange} disabled={disabled}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed">
          {children}
        </select>
      ) : (
        <input type={type} value={value} onChange={onChange} disabled={disabled}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed" />
      )}
    </div>
  );
}

// Modal component
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md z-10 border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><Icon name="close" cls="w-4 h-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function RequestTestPage() {
  const credits = 5; // Mock data - in real app this would come from context
  const [form, setForm] = useState({ role: "", category: "", difficulty: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [buyModal, setBuyModal] = useState(false);
  const canRequest = credits >= 1 && form.role && form.category && form.difficulty;

  const handleSubmit = () => {
    if (!canRequest) return;
    setLoading(true);
    setTimeout(() => {
      // Mock API call
      setLoading(false);
      setSuccess(true);
      setForm({ role: "", category: "", difficulty: "" });
    }, 1500);
  };

  const handleBuy = (amount) => {
    // Mock purchase logic
    setBuyModal(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Request a Test</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose your desired role and skill. Each test costs 1 credit.</p>
      </div>

      {/* Credits Banner */}
      <div className={`flex items-center justify-between p-4 rounded-xl border ${credits === 0 ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" : "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800"}`}>
        <div className="flex items-center gap-3">
          <Icon name="credits" cls={`w-5 h-5 ${credits === 0 ? "text-red-500" : "text-violet-600 dark:text-violet-400"}`} />
          <div>
            <p className={`text-sm font-semibold ${credits === 0 ? "text-red-700 dark:text-red-400" : "text-violet-700 dark:text-violet-300"}`}>
              {credits === 0 ? "No credits remaining!" : `${credits} credit${credits !== 1 ? "s" : ""} available`}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">1 test = 1 credit</p>
          </div>
        </div>
        <button onClick={() => setBuyModal(true)} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors">
          Buy Credits
        </button>
      </div>

      {credits === 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <Icon name="warning" cls="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-700 dark:text-red-400">You need at least 1 credit to request a test. Please purchase credits to continue.</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <Icon name="email" cls="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Test link sent to your email!</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">Check student@example.com for the test link.</p>
          </div>
        </div>
      )}

      <Card className="p-6 space-y-5">
        <FormInput label="Job Role / Internship Type" type="select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} disabled={credits === 0} required>
          <option value="">Select Role...</option>
          <option>SDE Intern</option>
          <option>Frontend Developer</option>
          <option>Backend Developer</option>
          <option>Full Stack Developer</option>
          <option>Data Analyst</option>
          <option>ML Intern</option>
          <option>DevOps Engineer</option>
          <option>UI/UX Designer</option>
          <option>Product Manager</option>
        </FormInput>

        <FormInput label="Skill Category" type="select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} disabled={credits === 0} required>
          <option value="">Select Category...</option>
          <option>DSA</option>
          <option>React</option>
          <option>Node.js</option>
          <option>Python</option>
          <option>Aptitude</option>
          <option>SQL</option>
          <option>System Design</option>
          <option>Machine Learning</option>
          <option>Linux / DevOps</option>
        </FormInput>

        <FormInput label="Difficulty Level" type="select" value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} disabled={credits === 0} required>
          <option value="">Select Difficulty...</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </FormInput>

        <button onClick={handleSubmit} disabled={!canRequest || loading}
          className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              Processing...
            </>
          ) : (
            <><Icon name="test" cls="w-4 h-4" /> Request Test (–1 Credit)</>
          )}
        </button>
      </Card>

      {/* Buy Credits Modal */}
      <Modal open={buyModal} onClose={() => setBuyModal(false)} title="Buy Credits">
        <div className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Choose a credit pack to continue requesting tests.</p>
          {[
            { amount: 1, price: "₹49", label: "Starter", sub: "Good for 1 test" },
            { amount: 5, price: "₹199", label: "Popular", sub: "Save 20%", highlight: true },
            { amount: 10, price: "₹349", label: "Pro", sub: "Save 30%" },
          ].map(pack => (
            <button key={pack.amount} onClick={() => handleBuy(pack.amount)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all hover:border-violet-400 text-left ${pack.highlight ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20" : "border-slate-200 dark:border-slate-600"}`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{pack.amount} Credits · {pack.label}</span>
                  {pack.highlight && <span className="text-xs bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-400 px-2 py-0.5 rounded-full font-semibold">Best Value</span>}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{pack.sub}</p>
              </div>
              <span className="text-base font-bold text-violet-600 dark:text-violet-400">{pack.price}</span>
            </button>
          ))}

          {/* Referral Section */}
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="gift" cls="w-4 h-4 text-amber-500" />
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Earn Free Credits!</p>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-500">Refer a friend and earn 2 credits when they sign up. Your referral code:</p>
            <div className="flex items-center gap-2 mt-2">
              <code className="flex-1 text-xs font-mono bg-white dark:bg-slate-700 border border-amber-200 dark:border-amber-700 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-200">ARYAN2026</code>
              <button className="px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg transition-colors flex items-center gap-1">
                <Icon name="copy" cls="w-3.5 h-3.5" />Copy
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
