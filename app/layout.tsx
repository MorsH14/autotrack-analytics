"use client"; // must be client component to use useEffect
import { useEffect } from "react";
import "./globals.css";
import { initTracker } from "@/lib/tracker";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    initTracker(); // initialize tracking on page load
  }, []);

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
