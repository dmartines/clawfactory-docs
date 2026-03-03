import Link from "next/link";

/**
 * A styled table that lists all CLI commands with links to their anchor sections.
 *
 * Props:
 *   commands  {Array<{ cmd, description, anchor }>}
 */
export function CommandTable({ commands }) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
            <th className="px-5 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">
              Command
            </th>
            <th className="px-5 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {commands.map(({ cmd, description, anchor }) => (
            <tr
              key={cmd}
              className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50"
            >
              <td className="px-5 py-3">
                <a
                  href={`#${anchor}`}
                  className="font-mono text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  {cmd}
                </a>
              </td>
              <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
