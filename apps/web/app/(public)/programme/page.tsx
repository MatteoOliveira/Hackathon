import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

// P03 — Programme / Ateliers
export const metadata: Metadata = {
  title: 'Programme',
  description:
    "Découvrez le programme complet de Solimouv' 2026 : ateliers sportifs, stands associatifs, horaires et lieux.",
};

interface Atelier {
  id: string;
  titre: string;
  description: string | null;
  horaire_debut: string;
  horaire_fin: string;
  lieu: string;
  capacite_max: number;
  public_cible: string[];
  code_stand: string;
  sports: { nom: string; slug: string } | null;
  associations: { nom: string; slug: string; couleur_theme: string } | null;
}

function formatHeure(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default async function ProgrammePage() {
  const supabase = await createClient();
  const { data: ateliers } = await supabase
    .from('ateliers')
    .select('*, sports(nom, slug), associations(nom, slug, couleur_theme)')
    .eq('actif', true)
    .order('horaire_debut', { ascending: true });

  return (
    <main id="main-content" className="py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* En-tête */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold">Programme</h1>
          <p className="mt-2 text-muted-foreground">
            11 juillet 2026 · Centre Sportif Charles Moureu, Paris — de 10h à 18h
          </p>
        </header>

        {/* TODO : filtres (sport, public, accessibilité) */}
        <div className="mb-8 p-4 rounded-lg bg-muted text-sm text-muted-foreground">
          Filtres par sport, public cible et accessibilité à implémenter.
        </div>

        {/* Liste des ateliers */}
        {!ateliers || ateliers.length === 0 ? (
          <p className="text-muted-foreground text-center py-16">
            Le programme sera publié prochainement.
          </p>
        ) : (
          <ol aria-label="Programme des ateliers" className="space-y-4">
            {(ateliers as Atelier[]).map((atelier) => (
              <li
                key={atelier.id}
                className="rounded-xl border border-border p-6 flex flex-col sm:flex-row gap-4"
              >
                {/* Horaire */}
                <div className="flex-shrink-0 text-center sm:text-left min-w-[80px]">
                  <time dateTime={atelier.horaire_debut} className="font-bold text-brand text-lg">
                    {formatHeure(atelier.horaire_debut)}
                  </time>
                  <p className="text-xs text-muted-foreground">
                    → {formatHeure(atelier.horaire_fin)}
                  </p>
                </div>

                {/* Infos */}
                <div className="flex-1">
                  <h2 className="font-semibold text-foreground text-lg">{atelier.titre}</h2>
                  {atelier.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{atelier.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {atelier.sports && (
                      <span className="px-2 py-1 rounded-full bg-brand/10 text-brand font-medium">
                        {atelier.sports.nom}
                      </span>
                    )}
                    {atelier.associations && (
                      <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                        {atelier.associations.nom}
                      </span>
                    )}
                    {atelier.public_cible.map((p) => (
                      <span key={p} className="px-2 py-1 rounded-full border border-border text-muted-foreground">
                        {p}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    📍 {atelier.lieu} · Max {atelier.capacite_max} pers.
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}
