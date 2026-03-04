import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ManwhaWham",
  description: "Manga & Manhwa reader — part of the Avosos ecosystem",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
