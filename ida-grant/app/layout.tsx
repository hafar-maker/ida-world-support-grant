import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IDA World Support Grant",
  description: "Financial assistance for individuals and families in need.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
