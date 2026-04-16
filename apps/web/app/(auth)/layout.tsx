import Link from 'next/link';

// Layout minimal pour les pages d'authentification (sans navbar/footer complets)
// TODO : rediriger vers /compte si l'utilisateur est déjà connecté (implémenter dans chaque page)
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header minimaliste */}
      <header className="border-b border-border px-4 sm:px-6 h-16 flex items-center">
        <Link href="/" className="font-bold text-brand text-xl" aria-label="Solimouv' — Accueil">
          <span aria-hidden>🏃</span> Solimouv&apos;
        </Link>
      </header>

      {/* Contenu centré */}
      <main id="main-content" className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        {children}
      </main>

      {/* Footer minimaliste */}
      <footer className="border-t border-border px-4 sm:px-6 h-12 flex items-center justify-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Up Sport! —{' '}
          <Link href="/mentions-legales" className="hover:underline">Mentions légales</Link>
          {' · '}
          <Link href="/politique-confidentialite" className="hover:underline">Confidentialité</Link>
        </p>
      </footer>
    </div>
  );
}
