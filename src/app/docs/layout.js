import DocsLayoutShell from "../../components/docs-layout-shell.jsx";

/**
 * Docs layout — server component wrapper.
 * Renders the shared sidebar + mobile drawer via the client-side DocsLayoutShell.
 */
export default function DocsLayout({ children }) {
  return <DocsLayoutShell>{children}</DocsLayoutShell>;
}
