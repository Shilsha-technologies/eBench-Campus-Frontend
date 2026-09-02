import { useEffect } from "react";
import { Tooltip } from "react-tooltip";

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);
  if (!isOpen) return null;
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 text-xl">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
// export function Table({ columns, data, emptyMessage = "No data found" }) {
//   if (!data.length) return (
//     <div className="text-center py-16 text-gray-400">
//       <div className="text-5xl mb-3">📭</div>
//       <p className="font-medium">{emptyMessage}</p>
//     </div>
//   );
//   return (
//     <div className="overflow-x-auto rounded-xl border border-gray-100">
//       <table className="w-full text-sm">
//         <thead>
//           <tr className="bg-gray-50 border-b border-gray-100">
//             {columns.map(col => (
//               <th key={col.key} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                 {col.label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, i) => (
//             <tr key={row.id || i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
//               {columns.map(col => (
//                 <td key={col.key} className="px-4 py-3 text-gray-700 whitespace-nowrap">
//                   {col.render ? col.render(row[col.key], row) : row[col.key] ?? "—"}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
export function Table({ columns, data, emptyMessage = "No data found", headerBg = "bg-gray-50", headerTextColor = "text-gray-500" }) {
  if (!data.length) return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-3">📭</div>
      <p className="font-medium">{emptyMessage}</p>
    </div>
  );
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className={`${headerBg} border-b border-gray-100`}>
            {columns.map((col, i) => (
              <th
                key={col.key}
                className={`text-left px-4 py-3 text-xs font-semibold ${headerTextColor} uppercase tracking-wide whitespace-nowrap ${i !== 0 ? "border-l border-gray-200" : ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              {columns.map((col, j) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-gray-700 whitespace-nowrap ${j !== 0 ? "border-l border-gray-200" : ""}`}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, required, error, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
      <input className={`border rounded-lg px-3 py-2.5 text-sm outline-none transition-all ${error ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"}`} {...props} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, required, options, error, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}  `}>
      {label && <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
      <select
        className={`px-3 py-2.5 rounded-xl border text-sm outline-none transition-all
        ${error
            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          }`}
        {...props}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-red-500" >
        {error}</p>}
    </div>
  );
}


// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, color = "indigo", change }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors[color]}`}>{icon}</div>
        {/* {change !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${change >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {change >= 0 ? "+" : ""}{change}%
          </span>
        )} */}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = "gray" }) {
  const variants = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    indigo: "bg-indigo-50 text-indigo-700",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>{children}</span>;
}
