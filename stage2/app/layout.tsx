import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Premium Scrollytelling",
  description: "A high-end scrollytelling experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-full flex flex-col bg-[#050505] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
