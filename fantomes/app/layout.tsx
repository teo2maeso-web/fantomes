import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://fantomes.app"),
  title: "Fantômes — Débusque les abonnements qu'on paie sans s'en servir",
  description:
    "Dépose ton relevé bancaire, on repère les prélèvements oubliés et on génère tes lettres de résiliation. Audit complet pour 9€.",
  openGraph: {
    title: "Fantômes — Débusque les abonnements qu'on paie sans s'en servir",
    description:
      "Dépose ton relevé bancaire, on repère les prélèvements oubliés et on génère tes lettres de résiliation.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary",
    title: "Fantômes — Débusque les abonnements qu'on paie sans s'en servir",
    description:
      "Dépose ton relevé bancaire, on repère les prélèvements oubliés et on génère tes lettres de résiliation.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${fraunces.variable} ${plexSans.variable} font-body bg-paper text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
