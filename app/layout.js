"use client";

import { useState } from "react";
import { Potta_One, Patua_One } from "next/font/google";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";
import PageTransition from "./components/PageTransition";

const pottaOne = Potta_One({
  weight: "400",
  variable: "--font-potta-one",
  subsets: ["latin"],
});

const patuaOne = Patua_One({
  weight: "400",
  variable: "--font-patua-one",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);

  return (
    <html lang="id">
      <body className={`${pottaOne.variable} ${patuaOne.variable} antialiased`}>
        {loading && <LoadingScreen onFinish={() => setLoading(false)} />}
        <div className={loading ? "opacity-0" : "opacity-100 transition-opacity duration-300"}>
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </body>
    </html>
  );
}