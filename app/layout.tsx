import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "JobTrackr — Your career, in motion",
  description: "Track one meaningful job application every day.",
  icons: { icon: "/jobtrackr-logo.jpeg", apple: "/jobtrackr-logo.jpeg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="antialiased"><StoreProvider>{children}</StoreProvider></body>
    </html>
  );
}
