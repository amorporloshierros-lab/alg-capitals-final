import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KeyRules x ALG Capital | Academia Cuantitativa",
  description: "Dominá el algoritmo y tu operativa con la metodología Quant de KeyRules. Trading institucional, backtesting riguroso y algoritmos de alta precisión.",
  openGraph: {
    title: "KeyRules x ALG Capital | Academia Cuantitativa",
    description: "Dominá el algoritmo y tu operativa con la metodología Quant de KeyRules.",
    url: "https://keyrulesalg.com",
    siteName: "ALG Capital",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="es"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}