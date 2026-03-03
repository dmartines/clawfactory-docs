/**
 * InlineCode — monospace code span with subtle background.
 */
export default function InlineCode({ children }) {
  return (
    <code className="px-1.5 py-0.5 rounded text-xs font-mono bg-slate-800 text-indigo-300 border border-slate-700">
      {children}
    </code>
  );
}
