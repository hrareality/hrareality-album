import type { Metadata } from "next";
import { Chakra_Petch, Inter } from "next/font/google";
import "./globals.css";

// Optimalizované Google Fonts pro herní dark vzhled
const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hra Reality | Sběratelské Album Hráče",
  description: "Zobraz si své získané artefakty, odemkni exkluzivní status a sleduj svůj celkový herní progress v albu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${chakraPetch.variable} ${inter.variable} h-full dark scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#060608] text-[#e2e8f0] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
