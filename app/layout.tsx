import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trading Chart Analyzer",
  description: "Advanced trading chart analysis with technical indicators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
