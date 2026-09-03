import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  User, Mail, Phone, Shield, Bell, MessageSquare,
  Clock, BarChart3, Save, Lock, Settings, Briefcase,
  CheckCircle, Eye, EyeOff,
} from "lucide-react";

/* ─────────────────────────────────────────────
   SUPERADMIN LIGHT THEME TOKENS
───────────────────────────────────────────── */
const G = {
  accent:        "#28ba5e",
  accentHover:   "#1e9e4f",
  accentGlow:    "rgba(40,186,94,.4)",
  accentBg:      "rgba(40,186,94,.1)",
  accentBorder:  "rgba(40,186,94,.3)",
  accentGrad:    "linear-gradient(135deg,#28ba5e,#1e9e4f)",
  text:          "#1e293b",
  textMuted:     "#64748b",
  textDim:       "#94a3b8",
  surface:       "#ffffff",
  border:        "rgba(40,186,94,.15)",
  borderSoft:    "rgba(40,186,94,.1)",
  stripe:        "linear-gradient(90deg,#28ba5e,#1e9e4f,#34d399)",
  bg:            "#f8fafb",
};

export default function SettingsPage() {
  /* ── form state ── */
  const [profile, setProfile] = useState({ name:"Admin User", email:"admin@ebench.ai", phone:"+91 98765 00001" });
  const [passwords, setPasswords] = useState({ current:"", newPw:"", confirm:"" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [toggles, setToggles] = useState({
    email:   true,
    sms:     false,
    expiry:  true,
    reports: true,
  });

  /* ── password strength ── */
  const pwStrength = (() => {
    const p = passwords.newPw;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)           s++;
    if (/[A-Z]/.test(p))         s++;
    if (/[0-9]/.test(p))         s++;
    if (/[^A-Za-z0-9]/.test(p))  s++;
    return s;
  })();
  const strengthLabel = ["","Weak","Fair","Good","Strong"][pwStrength];
  const strengthColor = ["","#ef4444","#f59e0b","#3b82f6","#10b981"][pwStrength];

  /* ── handlers ── */
  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!profile.name || !profile.email) {
      toast.error("Name and email are required");
      return;
    }
    toast.success("Profile updated successfully!");
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!passwords.current)                         { toast.error("Enter your current password"); return; }
    if (passwords.newPw.length < 8)                 { toast.error("New password must be at least 8 characters"); return; }
    if (passwords.newPw !== passwords.confirm)       { toast.error("Passwords do not match"); return; }
    toast.success("Password updated successfully!");
    setPasswords({ current:"", newPw:"", confirm:"" });
  };

  const flipToggle = (key) => setToggles(p => ({ ...p, [key]: !p[key] }));

  /* ── shared input style factory ── */
  const inputStyle = (field, hasPadRight = false) => ({
    width: "100%",
    background: focusedField === field ? "rgba(16,185,129,.06)" : "rgba(255,255,255,.04)",
    border: `1.5px solid ${focusedField === field ? "rgba(16,185,129,.55)" : G.borderSoft}`,
    borderRadius: 12,
    padding: `11px 14px 11px ${hasPadRight ? "40px" : "14px"}`,
    paddingRight: hasPadRight ? 42 : 14,
    color: G.text,
    fontSize: 14,
    outline: "none",
    transition: "all .2s",
    fontFamily: "'DM Sans', sans-serif",
    // boxShadow: focusedField === field ? "0 0 0 3px rgba(16,185,129,.1)" : "none",
  });

  /* ── toggle switch ── */
  const Toggle = ({ on, onClick }) => (
    <div onClick={onClick} style={{
      width: 40, height: 22, borderRadius: 99, cursor: "pointer", flexShrink: 0,
      background: on ? G.accentGrad : "rgba(255,255,255,.1)",
      position: "relative", transition: "all .25s",
      boxShadow: on ? `0 4px 14px ${G.accentGlow}` : "none",
    }}>
      <div style={{
        position: "absolute", top: 3, left: on ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%",
        background: "white", boxShadow: "0 1px 4px rgba(0,0,0,.3)",
        transition: "left .25s",
      }}/>
    </div>
  );

  /* ── section label ── */
  const SectionLabel = ({ text }) => (
    <p style={{ fontSize: 11, fontWeight: 700, color: G.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>{text}</p>
  );

  return (
    <>


      {/* ── Page ── */}
      <div className="bg-[#f8fafb]" style={{ position:"relative", zIndex:1, minHeight:"100vh", padding:"20px 20px", fontFamily:"'DM Sans',sans-serif" }}>

        {/* Page header */}
        <div className="fade-up d1" style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
          
          <div>
            <h1 style={{ color:'green', fontWeight:800, fontSize:22, letterSpacing:"-0.4px" }}>Admin Profile</h1>
            <p style={{ color:G.textMuted, fontSize:13, marginTop:2 }}>Manage your admin profile and platform preferences</p>
          </div>
        </div>

        {/* Grid layout */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:20, maxWidth:1100 }}>

          {/* ── Admin Profile Card ── */}
          <div className="fade-up d2" style={{
            background: G.surface,
            border: `1px solid ${G.border}`,
            borderRadius: 22,
            backdropFilter: "blur(32px)",
            boxShadow: "0 24px 64px rgba(241, 239, 239, 0.45), 0 0 0 1px rgba(255,255,255,.03) inset",
            overflow: "hidden",
          }}>
            <div style={{ height: 3, background: G.stripe }}/>
            <div style={{ padding: "22px 24px" }}>
              <SectionLabel text="Admin Profile"/>

              {/* Avatar */}
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22, padding:"14px 16px", background:"rgba(16,185,129,.07)", border:`1px solid ${G.accentBorder}`, borderRadius:14 }}>
                <div style={{ width:52, height:52, borderRadius:"50%", border:"2px solid rgba(16,185,129,.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:"#6ee7b7", flexShrink:0 }}>
                  AU
                </div>
                <div>
                  <p style={{ color:G.text, fontWeight:700, fontSize:15 }}>{profile.name || "Admin User"}</p>
                  <p style={{ color:G.textMuted, fontSize:12.5 }}>{profile.email || "admin@ebench.ai"}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:5 }}>
                    <CheckCircle size={12} color={G.accent}/>
                    <span style={{ fontSize:11.5, color:G.accent, fontWeight:600 }}>Verified Admin</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleProfileSave}>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

                  {/* Full Name */}
                  <div>
                    <label style={{ display:"block", color:G.textMuted, fontSize:12.5, fontWeight:600, marginBottom:6, letterSpacing:"0.03em" }}>Full Name</label>
                    <div style={{ position:"relative" }}>
                      <User size={14} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"rgba(148,163,184,.4)", pointerEvents:"none" }}/>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        style={{ ...inputStyle("name", true) }}
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display:"block", color:G.textMuted, fontSize:12.5, fontWeight:600, marginBottom:6, letterSpacing:"0.03em" }}>Email Address</label>
                    <div style={{ position:"relative" }}>
                      <Mail size={14} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"rgba(148,163,184,.4)", pointerEvents:"none" }}/>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        style={{ ...inputStyle("email", true) }}
                        placeholder="admin@company.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ display:"block", color:G.textMuted, fontSize:12.5, fontWeight:600, marginBottom:6, letterSpacing:"0.03em" }}>Phone Number</label>
                    <div style={{ position:"relative" }}>
                      <Phone size={14} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"rgba(148,163,184,.4)", pointerEvents:"none" }}/>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        style={{ ...inputStyle("phone", true) }}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  {/* Save button */}
                  <button type="submit" className="save-btn" style={{
                    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                    padding:"12px 20px", borderRadius:13, border:"none",
                    background: G.accentGrad, color:"#fff", fontSize:14, fontWeight:700,
                    cursor:"pointer", transition:"all .25s", fontFamily:"'DM Sans',sans-serif",
                    boxShadow:`0 8px 24px ${G.accentGlow}`, marginTop:4,
                  }}>
                    <Save size={15}/> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ── Change Password Card ── */}
          <div className="fade-up d3" style={{
            background: G.surface,
            border: `1px solid ${G.border}`,
            borderRadius: 22,
            backdropFilter: "blur(32px)",
            boxShadow: "0 24px 64px rgba(243, 241, 241, 0.45), 0 0 0 1px rgba(255,255,255,.03) inset",
            overflow: "hidden",
          }}>
            <div style={{ height:3, background:G.stripe }}/>
            <div style={{ padding:"22px 24px" }}>
              <SectionLabel text="Change Password"/>

              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", background:"rgba(16,185,129,.06)", border:`1px solid rgba(16,185,129,.18)`, borderRadius:12, marginBottom:18 }}>
                <Lock size={14} color={G.accent} style={{ flexShrink:0 }}/>
                <p style={{ fontSize:12.5, color:G.textMuted, lineHeight:1.5 }}>Use a strong password with uppercase, numbers, and symbols.</p>
              </div>

              <form onSubmit={handlePasswordUpdate}>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

                  {/* Current password */}
                  <div>
                    <label style={{ display:"block", color:G.textMuted, fontSize:12.5, fontWeight:600, marginBottom:6, letterSpacing:"0.03em" }}>Current Password</label>
                    <div style={{ position:"relative" }}>
                      <Shield size={14} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"rgba(148,163,184,.4)", pointerEvents:"none" }}/>
                      <input
                        type={showCurrent ? "text" : "password"}
                        value={passwords.current}
                        onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                        onFocus={() => setFocusedField("current")}
                        onBlur={() => setFocusedField(null)}
                        style={{ ...inputStyle("current", true), paddingLeft:40, paddingRight:42 }}
                        placeholder="Enter current password"
                      />
                      <button type="button" onClick={() => setShowCurrent(v => !v)} style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"rgba(148,163,184,.4)", cursor:"pointer", display:"flex", padding:2, transition:"color .2s" }}
                        onMouseEnter={e => e.currentTarget.style.color=G.accent}
                        onMouseLeave={e => e.currentTarget.style.color="rgba(148,163,184,.4)"}>
                        {showCurrent ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                    </div>
                  </div>

                  {/* New password */}
                  <div>
                    <label style={{ display:"block", color:G.textMuted, fontSize:12.5, fontWeight:600, marginBottom:6, letterSpacing:"0.03em" }}>New Password</label>
                    <div style={{ position:"relative" }}>
                      <Shield size={14} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"rgba(148,163,184,.4)", pointerEvents:"none" }}/>
                      <input
                        type={showNew ? "text" : "password"}
                        value={passwords.newPw}
                        onChange={e => setPasswords(p => ({ ...p, newPw: e.target.value }))}
                        onFocus={() => setFocusedField("newPw")}
                        onBlur={() => setFocusedField(null)}
                        style={{ ...inputStyle("newPw", true), paddingLeft:40, paddingRight:42 }}
                        placeholder="Min. 8 characters"
                      />
                      <button type="button" onClick={() => setShowNew(v => !v)} style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"rgba(148,163,184,.4)", cursor:"pointer", display:"flex", padding:2, transition:"color .2s" }}
                        onMouseEnter={e => e.currentTarget.style.color=G.accent}
                        onMouseLeave={e => e.currentTarget.style.color="rgba(148,163,184,.4)"}>
                        {showNew ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                    </div>
                    {/* Strength bar */}
                    {passwords.newPw && (
                      <div style={{ marginTop:8 }}>
                        <div style={{ display:"flex", gap:4, marginBottom:4 }}>
                          {[1,2,3,4].map(i => (
                            <div key={i} style={{ flex:1, height:3, borderRadius:99, background: i<=pwStrength ? strengthColor : "rgba(255,255,255,.08)", transition:"background .3s" }}/>
                          ))}
                        </div>
                        <span style={{ fontSize:11.5, color:strengthColor, fontWeight:600 }}>{strengthLabel}</span>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label style={{ display:"block", color:G.textMuted, fontSize:12.5, fontWeight:600, marginBottom:6, letterSpacing:"0.03em" }}>Confirm Password</label>
                    <div style={{ position:"relative" }}>
                      <Shield size={14} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"rgba(148,163,184,.4)", pointerEvents:"none" }}/>
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={passwords.confirm}
                        onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                        onFocus={() => setFocusedField("confirm")}
                        onBlur={() => setFocusedField(null)}
                        style={{
                          ...inputStyle("confirm", true),
                          paddingLeft:40, paddingRight:42,
                          border: `1.5px solid ${
                            passwords.confirm && passwords.confirm === passwords.newPw
                              ? "rgba(16,185,129,.55)"
                              : passwords.confirm && passwords.confirm !== passwords.newPw
                              ? "rgba(239,68,68,.5)"
                              : focusedField==="confirm" ? "rgba(16,185,129,.55)" : G.borderSoft
                          }`,
                        }}
                        placeholder="Re-enter new password"
                      />
                      <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"rgba(148,163,184,.4)", cursor:"pointer", display:"flex", padding:2, transition:"color .2s" }}
                        onMouseEnter={e => e.currentTarget.style.color=G.accent}
                        onMouseLeave={e => e.currentTarget.style.color="rgba(148,163,184,.4)"}>
                        {showConfirm ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                      {passwords.confirm && passwords.confirm === passwords.newPw && (
                        <CheckCircle size={14} color={G.accent} style={{ position:"absolute", right:38, top:"50%", transform:"translateY(-50%)" }}/>
                      )}
                    </div>
                    {passwords.confirm && passwords.confirm !== passwords.newPw && (
                      <p style={{ color:"#fca5a5", fontSize:12, marginTop:5 }}>Passwords do not match</p>
                    )}
                  </div>

                  {/* Update button */}
                  <button type="submit" className="save-btn" style={{
                    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                    padding:"12px 20px", borderRadius:13, border:"none",
                    background:G.accentGrad, color:"#fff", fontSize:14, fontWeight:700,
                    cursor:"pointer", transition:"all .25s", fontFamily:"'DM Sans',sans-serif",
                    boxShadow:`0 8px 24px ${G.accentGlow}`, marginTop:4,
                  }}>
                    <Lock size={15}/> Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>

     
    </>
  );
}