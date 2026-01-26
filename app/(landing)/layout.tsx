import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Footer from "../../components/Footer";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",  
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aki - Japanese Learning with AI",
  description:
    "Master Japanese with the old-school pen & paper method, enhanced by Aki, your AI voice partner. Structured curriculum, deep understanding, and writing practice.",
  keywords: [
    "Japanese learning",
    "AI tutor",
    "Japanese writing",
    "Kanji practice",
    "JLPT",
    "Study Japanese",
  ],
  openGraph: {
    title: "Aki - Japanese Learning with AI",
    description:
      "Master Japanese with the old-school pen & paper method, enhanced by Aki, your AI voice partner.",
    type: "website",
    locale: "en_US",
    siteName: "Aki",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aki - Japanese Learning with AI",
    description:
      "Master Japanese with the old-school pen & paper method, enhanced by Aki, your AI voice partner.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
