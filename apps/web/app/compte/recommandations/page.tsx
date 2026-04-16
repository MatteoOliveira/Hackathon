import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

// P18 — Mes sports recommandés
export const metadata: Metadata = {
  title: 'Mes sports recommandés',
  robots: { index: false },
};

export default async function RecommandationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: inscription } = await supabase
    .from('inscriptions')
    .select('sports_recommandes')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const sportIds: string[] = inscription?.sports_recommandes ?? [];

  const { data: sports } = sportIds.length > 0
    ? await supabase
        .from('sports')
        .select('id, nom, slug, description, intensite, accessibilite_handicap, icon, sport_associations(associations(nom, slug))')
        .in('id', sportIds)
    : { data: [] };

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold">Mes sports recommandés</h1>
        <p className="mt-1 text-muted-foreground">
          Sports sélectionnés par notre algorithme selon votre profil.
        </p>
      </header>

      {!sports || sports.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-4xl mb-4" aria-hidden>🧩</p>
          <p className="font-medium text-foreground">Aucune recommandation pour l&apos;instant</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Complétez le formulaire d&apos;inscription pour obtenir des recommandations personnalisées.
          </p>
          <Link
            href="/inscription"
            className="mt-6 inline-flex items-center px-4 py-2 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors text-sm"
          >
            Faire le matching
          </Link>
        </div>
      ) : (
        <ol className="space-y-6" aria-label="Sports recommandés">
          {(sports as {
            id: string;
            nom: string;
            slug: string;
            description: string | null;
            intensite: number | null;
            accessibilite_handicap: boolean;
            icon: string | null;
            sport_associations: { associations: { nom: string; slug: string } | null }[];
          }[]).map((sport, i) => (
            <li key={sport.id} className="flex gap-4 rounded-xl border border-border p-6">
              <span className="text-2xl font-bold text-brand/30 select-none" aria-hidden>
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  {sport.icon && <span className="text-2xl" aria-hidden>{sport.icon}</span>}
                  <h2 className="font-semibold text-xl text-foreground">{sport.nom}</h2>
                </div>
                {sport.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{sport.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {sport.accessibilite_handicap && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">♿ Adapté</span>
                  )}
                  {sport.sport_associations?.map(({ associations: asso }) =>
                    asso ? (
                      <Link
                        key={asso.slug}
                        href={`/associations/${asso.slug}`}
                        className="text-xs px-2 py-0.5 rounded-full bg-brand/10 text-brand hover:bg-brand/20 transition-colors"
                      >
                        {asso.nom}
                      </Link>
                    ) : null
                  )}
                </div>
                <Link
                  href={`/sports/${sport.slug}`}
                  className="mt-4 inline-flex text-sm font-medium text-brand hover:underline"
                >
                  Voir la fiche →
                </Link>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
