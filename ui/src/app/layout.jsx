import { AppProvider } from "@/context/AppContext";
import AppShell from "@/components/AppShell";
import "./globals.css";

export const instant = false;

export const metadata = {
  title: "Azuli Wealth | Yield Nodes",
  description: "Premium AI Yield Aggregation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Removed flex justify-center to let AppShell handle it */}
      <body className="text-slate-900 bg-black antialiased h-screen w-full overflow-hidden m-0 p-0">
        <AppProvider>
          <AppShell>
            {children}
          </AppShell>
        </AppProvider>
      </body>
    </html>
  );
}