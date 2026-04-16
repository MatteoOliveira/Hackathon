import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

// P07 — Fiche sport

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: sport } = await supabase
    .from('sports')
    .select('nom, description')
    .eq('slug', slug)
    .single();

  if (!sport) return { title: 'Sport introuvable' };

  return {
    title: sport.nom,
    description: sport.description ?? `Découvrez ${sport.nom} lors du festival Solimouv' 2026.`,
  };
}

export default async function SportDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: sport } = await supabase
    .from('sports')
    .select('*, sport_associations(associations(id, nom, slug, logo_url, couleur_theme))')
    .eq('slug', slug)
    .single();

  if (!sport) notFound();

  const associations = sport.sport_associations?.map((sa: { associations: unknown }) => sa.associations).filter(Boolean) ?? [];

  return (
    <main id="main-content" className="py-12">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-muted-foreground">
          <Link href="/sports" className="hover:text-foreground transition-colors">Sports</Link>
          {' / '}
          <span aria-current="page">{sport.nom}</span>
        </nav>

        {/* En-tête */}
        <header className="mb-10">
          {sport.icon && <p className="text-5xl mb-4" aria-hidden>{sport.icon}</p>}
          <h1 className="text-3xl font-extrabold">{sport.nom}</h1>

          {/* Badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-muted text-sm font-medium text-muted-foreground">
              Niveau : {sport.niveau_requis}
            </span>
            {sport.intensite && (
              <span className="px-3 py-1 rounded-full bg-muted text-sm font-medium text-muted-foreground">
                Intensité {sport.intensite}/5
              </span>
            )}
            {sport.accessibilite_handicap && (
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                ♿ Adapté aux personnes handicapées
              </span>
            )}
            {sport.accessibilite_debutant && (
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                Accessible aux débutants
              </span>
            )}
          </div>
        </header>

        {/* Description */}
        {sport.description && (
          <section aria-labelledby="desc-heading" className="mb-10">
            <h2 id="desc-heading" className="sr-only">Description</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{sport.description}</p>
          </section>
        )}

        {/* Matériel requis */}
        {sport.materiel_requis?.length > 0 && (
          <section aria-labelledby="materiel-heading" className="mb-10">
            <h2 id="materiel-heading" className="text-xl font-bold mb-3">Matériel requis</h2>
            <ul className="flex flex-wrap gap-2">
              {sport.materiel_requis.map((m: string) => (
                <li key={m} className="px-3 py-1 rounded-full border border-border text-sm text-foreground">
                  {m}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Tags (pour le matching) */}
        {sport.tags?.length > 0 && (
          <section aria-labelledby="tags-heading" className="mb-10">
            <h2 id="tags-heading" className="text-xl font-bold mb-3">Caractéristiques</h2>
            <ul className="flex flex-wrap gap-2">
              {sport.tags.map((tag: string) => (
                <li key={tag} className="px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium">
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Associations qui proposent ce sport */}
        {associations.length > 0 && (
          <section aria-labelledby="assos-heading">
            <h2 id="assos-heading" className="text-xl font-bold mb-4">Proposé par</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(associations as { id: string; nom: string; slug: string; couleur_theme: string }[]).map((asso) => (
                <li key={asso.id}>
                  <Link
                    href={`/associations/${asso.slug}`}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-brand/50 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: asso.couleur_theme }}
                      aria-hidden
                    >
                      {asso.nom.charAt(0)}
                    </div>
                    <span className="font-medium text-foreground">{asso.nom}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
