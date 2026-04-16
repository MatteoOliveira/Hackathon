import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Marque */}
          <div>
            <p className="font-bold text-brand text-lg mb-2">Solimouv&apos;</p>
            <p className="text-sm text-muted-foreground">
              Le festival du sport inclusif, organisé par{' '}
              <a
                href="https://www.unispourlesport.paris/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                Up Sport!
              </a>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              11 juillet 2026 · Centre Sportif Charles Moureu, Paris
            </p>
          </div>

          {/* Liens */}
          <nav aria-label="Liens du pied de page">
            <p className="font-semibold text-sm mb-3">Explorer</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                ['/a-propos', 'À propos'],
                ['/programme', 'Programme'],
                ['/associations', 'Associations'],
                ['/sports', 'Sports'],
                ['/contact', 'Contact'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Légal */}
          <nav aria-label="Liens légaux">
            <p className="font-semibold text-sm mb-3">Légal</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                ['/mentions-legales', 'Mentions légales'],
                ['/politique-confidentialite', 'Politique de confidentialité'],
                ['/accessibilite', 'Accessibilité'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          <p>© {year} Up Sport! — Fait avec 💙 pour un sport accessible à toutes et tous.</p>
        </div>
      </div>
    </footer>
  );
}
