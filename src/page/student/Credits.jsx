import { useState } from "react";

// Icons (inline SVG)
const Icon = ({ name, cls = "w-5 h-5" }) => {
  const icons = {
    credits: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    plus: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>,
    test: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
    gift: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12v10H4V12M2 7h20v5H2zM12 22V7m0-5a2.5 2.5 0 00-2.5 2.5c0 1.38 1.12 2.5 2.5 2.5m0-5a2.5 2.5 0 012.5 2.5C14.5 8.88 13.38 10 12 10"/></svg>,
    copy: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
    close: <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  };
  return icons[name] || null;
};

// Card component
function Card({ children, className = "" }) {
  return <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>{children}</div>;
}

// Stat Card component
function StatCard({ label, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  };
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon name={icon} cls="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </Card>
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

export default function CreditsPage() {
  // Mock data - in real app this would come from context/API
  const credits = 5;
  const creditHistory = [
    { id: 1, type: "purchase", amount: 5, date: "2026-04-01", note: "Pack of 5" },
    { id: 2, type: "used", amount: -1, date: "2026-04-10", note: "Data Analyst Test" },
    { id: 3, type: "used", amount: -1, date: "2026-04-15", note: "Frontend Dev Test" },
    { id: 4, type: "referral", amount: 2, date: "2026-04-18", note: "Referral: Sneha K." },
    { id: 5, type: "used", amount: -1, date: "2026-04-20", note: "SDE Intern Test" },
  ];

  const [buyModal, setBuyModal] = useState(false);
  const [refModal, setRefModal] = useState(false);

  const handleBuy = (amount) => {
    // Mock purchase logic
    setBuyModal(false);
  };

  const totalSpent = creditHistory.filter(h => h.type === "used").reduce((s, h) => s + Math.abs(h.amount), 0);
  const totalBought = creditHistory.filter(h => h.type !== "used").reduce((s, h) => s + h.amount, 0);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Credits</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your test credits.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Current Balance" value={credits} icon="credits" color="amber" />
        <StatCard label="Total Purchased" value={totalBought} icon="plus" color="green" />
        <StatCard label="Total Used" value={totalSpent} icon="test" color="blue" />
      </div>

      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setBuyModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors">
          <Icon name="plus" cls="w-4 h-4" /> Buy Credits
        </button>
        <button onClick={() => setRefModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-sm font-semibold rounded-xl hover:bg-amber-100 transition-colors">
          <Icon name="gift" cls="w-4 h-4" /> Refer & Earn
        </button>
      </div>

      {/* History Table */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Transaction History</h3>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-700">
          {creditHistory.map(h => (
            <div key={h.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  h.type === "used" 
                    ? "bg-red-50 dark:bg-red-900/20 text-red-500" 
                    : h.type === "referral" 
                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-500" 
                    : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500"
                }`}>
                  {h.type === "used" ? <Icon name="test" cls="w-4 h-4" /> : h.type === "referral" ? <Icon name="gift" cls="w-4 h-4" /> : <Icon name="plus" cls="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{h.note}</p>
                  <p className="text-xs text-slate-400">{h.date}</p>
                </div>
              </div>
              <span className={`font-bold text-sm ${h.amount < 0 ? "text-red-500" : "text-emerald-600"}`}>
                {h.amount > 0 ? "+" : ""}{h.amount}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Buy Modal */}
      <Modal open={buyModal} onClose={() => setBuyModal(false)} title="Purchase Credits">
        <div className="space-y-3">
          {[
            { amount: 1, price: "₹49", label: "Starter" },
            { amount: 5, price: "₹199", label: "Popular", highlight: true },
            { amount: 10, price: "₹349", label: "Pro" },
          ].map(pack => (
            <button key={pack.amount} onClick={() => handleBuy(pack.amount)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all hover:border-violet-400 ${
                pack.highlight 
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20" 
                  : "border-slate-200 dark:border-slate-600"
              }`}>
              <div className="flex items-center gap-2 text-left">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{pack.amount} Credits — {pack.label}</span>
                {pack.highlight && <span className="text-xs bg-violet-100 dark:bg-violet-800 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full font-semibold">Best Value</span>}
              </div>
              <span className="text-base font-bold text-violet-600 dark:text-violet-400">{pack.price}</span>
            </button>
          ))}
        </div>
      </Modal>

      {/* Referral Modal */}
      <Modal open={refModal} onClose={() => setRefModal(false)} title="Refer & Earn Credits">
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Share your referral code and earn <strong className="text-amber-600">2 free credits</strong> for every friend who signs up!</p>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">Your Referral Code</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-lg font-mono font-bold tracking-widest text-amber-700 dark:text-amber-400 bg-white dark:bg-slate-700 px-4 py-2.5 rounded-xl border border-amber-200 dark:border-amber-700">ARYAN2026</code>
              <button className="px-3 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl flex items-center gap-1 text-sm font-semibold transition-colors">
                <Icon name="copy" cls="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[["Share Code", "👥"], ["Friend Signs Up", "✅"], ["Earn 2 Credits", "🎁"]].map(([label, emoji], i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <div className="text-2xl mb-1">{emoji}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
