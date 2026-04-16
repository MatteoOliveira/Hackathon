import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

// P05 — Fiche association

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: asso } = await supabase
    .from('associations')
    .select('nom, description')
    .eq('slug', slug)
    .eq('actif', true)
    .single();

  if (!asso) return { title: 'Association introuvable' };

  return {
    title: asso.nom,
    description: asso.description ?? `Découvrez ${asso.nom}, association partenaire de Solimouv' 2026.`,
  };
}

export default async function AssociationDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: asso } = await supabase
    .from('associations')
    .select('*, sport_associations(sports(id, nom, slug, description, intensite, accessibilite_handicap))')
    .eq('slug', slug)
    .eq('actif', true)
    .single();

  if (!asso) notFound();

  const sports = asso.sport_associations?.map((sa: { sports: unknown }) => sa.sports).filter(Boolean) ?? [];

  return (
    <main id="main-content" className="py-12">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-muted-foreground">
          <Link href="/associations" className="hover:text-foreground transition-colors">
            Associations
          </Link>
          {' / '}
          <span aria-current="page">{asso.nom}</span>
        </nav>

        {/* En-tête */}
        <header className="flex items-start gap-6 mb-10">
          {asso.logo_url ? (
            <Image
              src={asso.logo_url}
              alt={`Logo ${asso.nom}`}
              width={80}
              height={80}
              className="rounded-xl object-contain flex-shrink-0"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
              style={{ backgroundColor: asso.couleur_theme }}
              aria-hidden
            >
              {asso.nom.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-extrabold">{asso.nom}</h1>
            {asso.site_web && (
              <a
                href={asso.site_web}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm text-brand hover:underline"
              >
                {asso.site_web.replace(/^https?:\/\//, '')} ↗
              </a>
            )}
          </div>
        </header>

        {/* Description */}
        {asso.description && (
          <section aria-labelledby="desc-heading" className="mb-12">
            <h2 id="desc-heading" className="sr-only">Description</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{asso.description}</p>
          </section>
        )}

        {/* Sports proposés */}
        {sports.length > 0 && (
          <section aria-labelledby="sports-heading" className="mb-12">
            <h2 id="sports-heading" className="text-xl font-bold mb-4">Sports proposés</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(sports as { id: string; nom: string; slug: string; description: string | null; intensite: number | null; accessibilite_handicap: boolean }[]).map((sport) => (
                <li key={sport.id}>
                  <Link
                    href={`/sports/${sport.slug}`}
                    className="block rounded-lg border border-border p-4 hover:border-brand/50 transition-colors"
                  >
                    <p className="font-semibold text-foreground">{sport.nom}</p>
                    {sport.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{sport.description}</p>
                    )}
                    <div className="mt-2 flex gap-2">
                      {sport.accessibilite_handicap && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          ♿ Adapté
                        </span>
                      )}
                      {sport.intensite && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Intensité {sport.intensite}/5
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Contact */}
        {asso.contact_email && (
          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="text-xl font-bold mb-3">Contact</h2>
            <a
              href={`mailto:${asso.contact_email}`}
              className="text-brand hover:underline"
            >
              {asso.contact_email}
            </a>
          </section>
        )}
      </div>
    </main>
  );
}
