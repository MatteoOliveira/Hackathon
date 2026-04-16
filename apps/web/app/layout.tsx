import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://solimouv.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Solimouv' — Festival du sport inclusif",
    template: "%s — Solimouv' 2026",
  },
  description:
    "Le festival du sport pour toutes et tous, organisé par Up Sport! le 11 juillet 2026 au Centre Sportif Charles Moureu, Paris.",
  keywords: ['festival', 'sport', 'inclusif', 'Paris', 'Up Sport', 'Solimouv', 'handicap', 'accessibilité'],
  authors: [{ name: 'Up Sport!', url: 'https://www.unispourlesport.paris/' }],
  creator: 'Up Sport!',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: "Solimouv'",
    title: "Solimouv' 2026 — Festival du sport inclusif",
    description: "Le festival du sport pour toutes et tous. 11 juillet 2026, Paris.",
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: "Solimouv' 2026" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Solimouv' 2026",
    description: "Festival du sport inclusif — 11 juillet 2026, Paris",
    images: ['/og/default.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#4F46E5',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        {/* Skip link — accessibilité clavier */}
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  );
}
