/**
 * Inlined script that runs before React hydration to apply the saved
 * theme class (dark/light) and avoid a flash of wrong colour scheme.
 */
export function ThemeScript() {
  const script = `
(function () {
  try {
    var stored = localStorage.getItem('cf-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (_) {}
})();
  `.trim();

  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
