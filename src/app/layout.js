import "./globals.css";

export const metadata = {
  title: "Valora — Offline Ledger & Expense Tracker",
  description: "Track your income, expenses, categories, and wealth progress completely offline, no ads.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Valora" />
        <link rel="icon" type="image/svg+xml" href="/app-icon.svg" />
        <link rel="apple-touch-icon" href="/app-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        {/* Inline script: read theme before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('valora_theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
