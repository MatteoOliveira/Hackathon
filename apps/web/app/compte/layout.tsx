import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

const compteNavLinks = [
  { href: '/compte', label: 'Tableau de bord' },
  { href: '/compte/profil', label: 'Mon profil' },
  { href: '/compte/passeport', label: 'Mon passeport' },
  { href: '/compte/recommandations', label: 'Mes sports' },
];

// Layout protégé — redirige vers /connexion si non authentifié
export default async function CompteLayout({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/connexion?redirect=/compte');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header compte */}
      <header className="border-b border-border bg-background sticky top-0 z-40">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-brand text-xl">
            <span aria-hidden>🏃</span> Solimouv&apos;
          </Link>
          <nav aria-label="Navigation compte" className="hidden sm:flex items-center gap-4 text-sm">
            {compteNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* TODO : bouton déconnexion */}
          <form>
            <button
              type="submit"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <main id="main-content" className="container mx-auto max-w-7xl px-4 sm:px-6 py-10">
        {children}
      </main>
    </div>
  );
}
