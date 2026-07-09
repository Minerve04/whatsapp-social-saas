import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Postly",
  description: "Publiez sur tous vos réseaux en envoyant une photo sur WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
