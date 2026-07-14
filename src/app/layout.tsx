import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LakenChat from "@/components/LakenChat";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Laken's Job Journey 💕",
  description:
    "A friendly job search & resume helper made just for Laken. Find your perfect data entry role!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
          {children}
        </main>
        <LakenChat />
        <Footer />
      </body>
    </html>
  );
}
