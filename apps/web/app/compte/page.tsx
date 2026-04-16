import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

// P15 — Tableau de bord utilisateur
export const metadata: Metadata = {
  title: 'Mon espace',
  robots: { index: false },
};

export default async function ComptePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('prenom, centres_interet, consent_notifs')
    .eq('id', user!.id)
    .single();

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold">
          Bonjour, {profile?.prenom ?? 'Participant'} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">Bienvenue dans votre espace Solimouv&apos;</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Passeport */}
        <Link
          href="/compte/passeport"
          className="group rounded-xl border border-border p-6 hover:border-brand/50 hover:shadow-md transition-all"
        >
          <p className="text-3xl mb-3" aria-hidden>🎫</p>
          <h2 className="font-semibold text-lg group-hover:text-brand transition-colors">
            Mon passeport
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Suivez votre progression au festival
          </p>
        </Link>

        {/* Recommandations */}
        <Link
          href="/compte/recommandations"
          className="group rounded-xl border border-border p-6 hover:border-brand/50 hover:shadow-md transition-all"
        >
          <p className="text-3xl mb-3" aria-hidden>🧩</p>
          <h2 className="font-semibold text-lg group-hover:text-brand transition-colors">
            Mes sports recommandés
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sports matchés à votre profil
          </p>
        </Link>

        {/* Profil */}
        <Link
          href="/compte/profil"
          className="group rounded-xl border border-border p-6 hover:border-brand/50 hover:shadow-md transition-all"
        >
          <p className="text-3xl mb-3" aria-hidden>👤</p>
          <h2 className="font-semibold text-lg group-hover:text-brand transition-colors">
            Mon profil
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Modifier vos informations et préférences
          </p>
        </Link>
      </div>
    </div>
  );
}
