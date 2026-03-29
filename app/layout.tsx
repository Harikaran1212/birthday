import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Happy Birthday Suwathika! 🎂",
  description: "A special birthday wishes page for Suwathika — filled with love, memories, and heartfelt wishes from everyone who cares.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Navbar />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
