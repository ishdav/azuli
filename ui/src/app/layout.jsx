import { AppProvider } from "@/context/AppContext";
import AppShell from "@/components/AppShell";
import "./globals.css";

export const instant = false;

export const metadata = {
  title: "Azuli Wealth",
  description: "Premium AI Yield Aggregation",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="text-slate-900 antialiased h-screen w-full overflow-hidden m-0 p-0">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}