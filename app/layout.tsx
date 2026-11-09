import type { Metadata, Viewport } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ReliQ | ريليك — Space Rovers Explorer",
  description:
    "Interactive learning platform for students aged 14–18 about the rovers that explored the Moon and Mars.",
};

export const viewport: Viewport = {
  themeColor: "#05060f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Tajawal:wght@400;500;700;800&display=swap"
        />
      </head>
      <body className="relative flex min-h-full flex-col">
        <div className="stars" aria-hidden />
        <LangProvider>
          <Header />
          <main className="relative flex-1">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
