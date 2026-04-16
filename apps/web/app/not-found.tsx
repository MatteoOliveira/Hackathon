import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page introuvable (404)',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-brand/20 select-none" aria-hidden>404</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">Page introuvable</h1>
      <p className="mt-2 text-muted-foreground max-w-sm">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-lg font-semibold hover:bg-brand-dark transition-colors"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
