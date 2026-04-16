'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: envoyer l'erreur à un service de monitoring (Sentry, etc.)
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-destructive/20 select-none" aria-hidden>500</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">Une erreur est survenue</h1>
      <p className="mt-2 text-muted-foreground max-w-sm">
        Quelque chose s&apos;est mal passé. Nos équipes ont été notifiées.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-lg font-semibold hover:bg-brand-dark transition-colors"
      >
        Réessayer
      </button>
    </main>
  );
}
