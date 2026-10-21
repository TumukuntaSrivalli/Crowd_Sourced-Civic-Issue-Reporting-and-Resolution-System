import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import NavbarWrapper from "@/components/NavbarWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CivicSense | Crowdsourced Civic Issue Reporting & Resolution System",
  description:
    "Next-generation civic issue reporting, automated AI classification, real-time geo-tracking, and municipal Power BI analytics.",
  keywords: [
    "civic issue",
    "citizen reporting",
    "municipal management",
    "power bi civic analytics",
    "ai issue detection",
    "smart governance",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <NavbarWrapper />
            <div className="flex-1 flex flex-col">{children}</div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}