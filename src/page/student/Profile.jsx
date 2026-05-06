import { useState } from "react";

// Icons (inline SVG)
const Icon = ({ name, cls = "w-5 h-5" }) => {
  const icons = {
    profile: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
    close: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
    check: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
    upload: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>,
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

export default function ProfilePage() {
  // Mock student data - in real app this would come from context/API
  const [form, setForm] = useState({
    name: "Aryan Mehta",
    email: "aryan.mehta@gmail.com",
    phone: "+91 9876543210",
    gender: "Male",
    college: "IIT Bombay",
    degree: "B.Tech",
    branch: "Computer Science",
    year: "3rd Year",
    skills: ["React", "Node.js", "Python", "DSA"],
    skillInput: "",
    resume: null,
  });

  const [saving, setSaving] = useState(false);

  const profileFields = [form.phone, form.college, form.degree, form.branch, form.year, form.skills.length > 0, form.resume];
  const profilePct = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const addSkill = () => {
    if (form.skillInput.trim() && !form.skills.includes(form.skillInput.trim())) {
      update("skills", [...form.skills, form.skillInput.trim()]);
      update("skillInput", "");
    }
  };
  const removeSkill = (s) => update("skills", form.skills.filter(x => x !== s));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">My Profile</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Keep your profile updated to maximize hiring chances.</p>
      </div>

      {/* Profile Completeness */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Profile Completeness</p>
          <span className={`text-sm font-bold ${profilePct >= 80 ? "text-emerald-600" : profilePct >= 50 ? "text-amber-500" : "text-red-500"}`}>{profilePct}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div style={{ width: `${profilePct}%` }}
            className={`h-full rounded-full transition-all duration-500 ${profilePct >= 80 ? "bg-emerald-500" : profilePct >= 50 ? "bg-amber-400" : "bg-red-400"}`} />
        </div>
        {profilePct < 100 && <p className="text-xs text-slate-400 mt-1.5">Complete all fields to reach 100% and improve your visibility to employers.</p>}
      </Card>

      <Card className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput label="Full Name" value={form.name} onChange={e => update("name", e.target.value)} required />
          <FormInput label="Email (readonly)" value={form.email} onChange={() => {}} disabled />
          <FormInput label="Phone" type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} />
          <FormInput label="Gender" type="select" value={form.gender} onChange={e => update("gender", e.target.value)}>
            <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
          </FormInput>
          <div className="sm:col-span-2">
            <FormInput label="College Name" value={form.college} onChange={e => update("college", e.target.value)} />
          </div>
          <FormInput label="Degree" type="select" value={form.degree} onChange={e => update("degree", e.target.value)}>
            <option>B.Tech</option><option>B.Sc</option><option>BCA</option><option>MCA</option><option>M.Tech</option><option>MBA</option>
          </FormInput>
          <FormInput label="Branch / Stream" value={form.branch} onChange={e => update("branch", e.target.value)} />
          <FormInput label="Year of Study" type="select" value={form.year} onChange={e => update("year", e.target.value)}>
            <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Alumni</option>
          </FormInput>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">Skills</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {form.skills.map(s => (
              <span key={s} className="flex items-center gap-1 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-full text-xs font-semibold">
                {s}
                <button onClick={() => removeSkill(s)} className="hover:text-red-500"><Icon name="close" cls="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              placeholder="Add a skill..." 
              value={form.skillInput} 
              onChange={e => update("skillInput", e.target.value)}
              onKeyDown={e => e.key === "Enter" && addSkill()}
              className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40" 
            />
            <button 
              onClick={addSkill} 
              className="px-4 py-2.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-xl font-semibold text-sm hover:bg-violet-200 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">Resume</label>
          <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            form.resume 
              ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20" 
              : "border-slate-200 dark:border-slate-600 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10"
          }`}>
            <input 
              type="file" 
              className="hidden" 
              onChange={e => { if (e.target.files[0]) update("resume", e.target.files[0].name); }} 
              accept=".pdf,.doc,.docx" 
            />
            <Icon name="upload" cls={`w-6 h-6 mb-1 ${form.resume ? "text-emerald-500" : "text-slate-400"}`} />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {form.resume ? `✓ ${form.resume}` : "Click to upload PDF or DOC"}
            </p>
          </label>
        </div>

        <button 
          onClick={handleSave} 
          disabled={saving}
          className="px-20 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
        >
          {saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Saving...
            </>
          ) : (
            <><Icon name="check" cls="w-4 h-4" />Save Profile</>
          )}
        </button>
      </Card>
    </div>
  );
}
