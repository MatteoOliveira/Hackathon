import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

// P06 — Sports
export const metadata: Metadata = {
  title: 'Sports',
  description:
    "Catalogue de tous les sports proposés lors du festival Solimouv' 2026. Filtrez par niveau, accessibilité et type d'activité.",
};

interface Sport {
  id: string;
  nom: string;
  slug: string;
  description: string | null;
  niveau_requis: string;
  intensite: number | null;
  accessibilite_handicap: boolean;
  accessibilite_debutant: boolean;
  type_activite: string[];
  tags: string[];
  icon: string | null;
}

const intensiteLabel = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

export default async function SportsPage() {
  const supabase = await createClient();
  const { data: sports } = await supabase
    .from('sports')
    .select('id, nom, slug, description, niveau_requis, intensite, accessibilite_handicap, accessibilite_debutant, type_activite, tags, icon')
    .order('nom', { ascending: true })
    .throwOnError()
    .catch(() => ({ data: null }));

  return (
    <main id="main-content" className="py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold">Sports</h1>
          <p className="mt-2 text-muted-foreground">
            {sports?.length ?? '–'} activités sportives à découvrir lors du festival.
          </p>
        </header>

        {/* TODO : filtres (type, accessibilité, intensité) */}

        {!sports || sports.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            Les sports seront présentés prochainement.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Catalogue des sports">
            {(sports as Sport[]).map((sport) => (
              <li key={sport.id}>
                <Link
                  href={`/sports/${sport.slug}`}
                  className="group block rounded-xl border border-border p-6 hover:border-brand/50 hover:shadow-md transition-all h-full"
                >
                  {sport.icon && <p className="text-3xl mb-3" aria-hidden>{sport.icon}</p>}
                  <h2 className="font-semibold text-foreground text-lg group-hover:text-brand transition-colors">
                    {sport.nom}
                  </h2>
                  {sport.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{sport.description}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {sport.niveau_requis}
                    </span>
                    {sport.intensite && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground" aria-label={`Intensité ${sport.intensite} sur 5`}>
                        {intensiteLabel(sport.intensite)}
                      </span>
                    )}
                    {sport.accessibilite_handicap && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        ♿ Adapté
                      </span>
                    )}
                    {sport.accessibilite_debutant && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Débutant OK
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
