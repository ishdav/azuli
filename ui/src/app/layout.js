import { AppProvider } from "@/context/AppContext";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata = { title: "Shadeform App", description: "AI Computing Power" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 flex justify-center min-h-screen">
        <AppProvider>
          <main className="w-full max-w-md bg-green-100 min-h-screen relative shadow-2xl pb-20">
            {children}
            <BottomNav />
          </main>
        </AppProvider>
      </body>
    </html>
  );
}