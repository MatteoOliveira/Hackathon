import Link from 'next/link';

const navLinks = [
  { href: '/programme', label: 'Programme' },
  { href: '/associations', label: 'Associations' },
  { href: '/sports', label: 'Sports' },
  { href: '/inscription', label: "S'inscrire" },
  { href: '/passeport', label: 'Passeport' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-brand text-xl" aria-label="Solimouv' — Accueil">
          <span aria-hidden>🏃</span>
          <span>Solimouv&apos;</span>
        </Link>

        {/* Navigation principale — desktop */}
        <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + compte */}
        <div className="flex items-center gap-3">
          <Link
            href="/connexion"
            className="hidden sm:inline-flex text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/inscription"
            className="inline-flex items-center px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors"
          >
            Participer
          </Link>
        </div>

        {/* TODO : menu burger mobile */}
      </div>
    </header>
  );
}
