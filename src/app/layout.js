import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider.jsx";
import Header from "@/components/header.jsx";
import { Footer } from "@/components/ui/footer.jsx";

export const metadata = {
  title: "ClawFactory — Spec-Driven Software Factory",
  description:
    "Write a markdown spec, and AI agents build the full-stack app — code, tests, deployment, and all.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased flex min-h-screen flex-col">
        {/*
          ThemeProvider is a Client Component that manages the dark/light class
          on <html> via the useTheme hook. suppressHydrationWarning on <html>
          prevents the React mismatch warning when the class is updated
          client-side before hydration completes.
        */}
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
