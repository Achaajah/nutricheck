"use client";

import FloatingAI from "./components/FloatingAI";
import { useState } from "react";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";
import PageTransition from "./components/PageTransition";

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);

  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} ${inter.variable} antialiased`}>
        {loading && <LoadingScreen onFinish={() => setLoading(false)} />}
        <div className={loading ? "opacity-0" : "opacity-100 transition-opacity duration-300"}>
          <PageTransition>
            {children}
          </PageTransition>
        </div>
        {!loading && <FloatingAI />}
      </body>
    </html>
  );
}