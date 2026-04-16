import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hors-ligne',
  robots: { index: false },
};

// P26 — Affichée par le service worker quand une page n'est pas en cache et qu'il n'y a pas de réseau
export default function OfflinePage() {
  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background">
      <div className="text-6xl mb-4" aria-hidden>📵</div>
      <h1 className="text-2xl font-bold text-foreground">Vous êtes hors-ligne</h1>
      <p className="mt-2 text-muted-foreground max-w-sm">
        Cette page n&apos;est pas disponible sans connexion internet.
        Les pages déjà visitées restent accessibles.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-lg font-semibold"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
