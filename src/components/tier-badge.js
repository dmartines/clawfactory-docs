/**
 * TierBadge — colored pill for permission tiers and model tiers.
 */
const VARIANTS = {
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  slate: "bg-slate-700/50 text-slate-300 border-slate-600",
  sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

export default function TierBadge({ label, variant = "slate" }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border font-mono ${VARIANTS[variant]}`}
    >
      {label}
    </span>
  );
}
