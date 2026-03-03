/**
 * FeatureCard — Icon + title + description
 *
 * Displays a single feature with an SVG icon, bold title, and short description.
 * Designed to be used inside a responsive grid on the landing page features section.
 *
 * Props match the FeatureCardSchema from lib/contracts/feature-card.js.
 *
 * @param {{ id: string, icon: string, title: string, description: string }} props
 */
import React from "react";

export default function FeatureCard({ id, icon, title, description }) {
  return (
    <article
      data-testid={`feature-card-${id}`}
      className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition-colors hover:border-indigo-500/50 hover:bg-slate-900"
    >
      {/* Icon container */}
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6 text-indigo-400"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold tracking-tight text-slate-50">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
    </article>
  );
}
