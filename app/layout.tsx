import "./globals.css";

export const metadata = {
  title: "AutoTrack Analytics",
  description: "Lightweight, self-hosted website analytics",
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
