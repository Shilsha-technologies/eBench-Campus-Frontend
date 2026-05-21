export default function ProgressBar({ value, label, color = "indigo", showLabel = true }) {
  const colors = {
    indigo: "bg-indigo-500", emerald: "bg-emerald-500",
    amber: "bg-amber-500", rose: "bg-rose-500",
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{label}</span>
          <span className="font-semibold text-gray-800">{value}%</span>
        </div>
      )}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${colors[color]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
