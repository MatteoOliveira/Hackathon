import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/associations', label: 'Associations', icon: '🏢' },
  { href: '/admin/sports', label: 'Sports', icon: '⚽' },
  { href: '/admin/ateliers', label: 'Ateliers', icon: '📅' },
  { href: '/admin/inscriptions', label: 'Inscriptions', icon: '📝' },
  { href: '/admin/messages', label: 'Messages', icon: '📬' },
  { href: '/admin/config', label: 'Paramètres', icon: '⚙️' },
];

// Layout protégé — vérifie la session ET le rôle admin/super_admin
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let profileData = { prenom: 'Admin', role: 'super_admin' };

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/connexion?redirect=/admin');

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, prenom')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) redirect('/');
    profileData = profile;
  }

  const profile = profileData;

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-background border-r border-border flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-border">
          <Link href="/" className="font-bold text-brand text-lg">
            🏃 Solimouv&apos;
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">Espace admin</p>
        </div>

        <nav aria-label="Navigation admin" className="flex-1 p-4">
          <ul className="space-y-1">
            {adminNavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <span aria-hidden>{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">
            {profile.prenom} · {profile.role}
          </p>
          {/* TODO : bouton déconnexion */}
          <Link
            href="/"
            className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Retour au site
          </Link>
        </div>
      </aside>

      {/* Contenu principal */}
      <main id="main-content" className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
