/**
 * StepCard — Numbered step with title + description.
 *
 * Displays one item in a sequential "How It Works" flow.
 * The step number is shown in an accented circle badge,
 * followed by the step's title and a supporting description.
 *
 * @param {{ step: number, title: string, description: string }} props
 */
export default function StepCard({ step, title, description }) {
  return (
    <div className="flex gap-5 group">
      {/* Step badge + vertical connector */}
      <div className="flex flex-col items-center">
        {/* Number circle */}
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                     bg-indigo-500 text-white font-mono text-sm font-semibold
                     ring-2 ring-indigo-500/30 shadow-sm
                     transition-transform duration-200 group-hover:scale-110"
        >
          {step}
        </div>

        {/* Vertical connector line (hidden on last child via CSS sibling trick) */}
        <div
          aria-hidden="true"
          className="mt-2 w-px flex-1 bg-indigo-500/20 group-last:hidden"
        />
      </div>

      {/* Text content */}
      <div className="pb-8 pt-1">
        <h3 className="text-base font-semibold text-slate-100 leading-snug mb-1">
          {title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
