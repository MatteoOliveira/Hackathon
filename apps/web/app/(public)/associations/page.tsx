import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

// P04 — Associations partenaires
export const metadata: Metadata = {
  title: 'Associations partenaires',
  description:
    "Découvrez les 13 associations sportives parisiennes partenaires de Solimouv' 2026, engagées pour un sport inclusif et accessible.",
};

interface Association {
  id: string;
  nom: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  site_web: string | null;
  couleur_theme: string;
  ordre_affichage: number;
}

export default async function AssociationsPage() {
  const supabase = await createClient();
  const { data: associations } = await supabase
    .from('associations')
    .select('id, nom, slug, description, logo_url, site_web, couleur_theme, ordre_affichage')
    .eq('actif', true)
    .order('ordre_affichage', { ascending: true })
    .throwOnError()
    .catch(() => ({ data: null }));

  return (
    <main id="main-content" className="py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold">Associations partenaires</h1>
          <p className="mt-2 text-muted-foreground">
            13 structures engagées pour rendre le sport accessible à Paris.
          </p>
        </header>

        {!associations || associations.length === 0 ? (
          <p className="text-muted-foreground text-center py-16">
            Les associations seront présentées prochainement.
          </p>
        ) : (
          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-label="Liste des associations partenaires"
          >
            {(associations as Association[]).map((asso) => (
              <li key={asso.id}>
                <Link
                  href={`/associations/${asso.slug}`}
                  className="group block rounded-xl border border-border p-6 hover:border-brand/50 hover:shadow-md transition-all h-full"
                >
                  {/* Logo */}
                  <div className="flex items-center gap-4 mb-4">
                    {asso.logo_url ? (
                      <Image
                        src={asso.logo_url}
                        alt={`Logo ${asso.nom}`}
                        width={56}
                        height={56}
                        className="rounded-lg object-contain"
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-lg flex items-center justify-center text-white text-xl font-bold"
                        style={{ backgroundColor: asso.couleur_theme }}
                        aria-hidden
                      >
                        {asso.nom.charAt(0)}
                      </div>
                    )}
                    <h2 className="font-semibold text-foreground group-hover:text-brand transition-colors">
                      {asso.nom}
                    </h2>
                  </div>
                  {asso.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{asso.description}</p>
                  )}
                  <p className="mt-4 text-xs font-medium text-brand">Voir la fiche →</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
