/**
 * ConceptCard — a highlighted section card used on /docs/concepts.
 * Renders an icon, title, tagline, and prose body.
 */
export default function ConceptCard({ icon, title, tagline, children, id }) {
  return (
    <section
      id={id}
      className="group relative rounded-xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 scroll-mt-20 transition-colors hover:border-slate-700"
    >
      {/* Subtle indigo glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99,102,241,0.04), transparent 40%)",
        }}
        aria-hidden="true"
      />

      <div className="flex items-start gap-4">
        {/* Icon badge */}
        <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-lg">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-3 mb-1">
            <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
            {tagline && (
              <span className="text-sm text-indigo-400 font-mono">
                — {tagline}
              </span>
            )}
          </div>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-400">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
