import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { ToastProvider } from "@/components/ui/Toast";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tata CLiQ — Fashion, Electronics, Luxury & Home",
  description:
    "Shop the latest in Fashion, Electronics, Luxury, and Home at Tata CLiQ. Authenticity guaranteed.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${dmSans.variable} font-body bg-surface text-primary-text antialiased`}
      >
        <ToastProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <BottomNav />
        </ToastProvider>
      </body>
    </html>
  );
}
