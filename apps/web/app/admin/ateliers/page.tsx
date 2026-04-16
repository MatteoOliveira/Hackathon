import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

// P22 — CRUD Ateliers
export const metadata: Metadata = {
  title: 'Ateliers — Admin',
  robots: { index: false },
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function AdminAteliersPage() {
  const supabase = await createClient();
  const { data: ateliers } = await supabase
    .from('ateliers')
    .select('*, sports(nom), associations(nom)')
    .order('horaire_debut', { ascending: true });

  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold">Ateliers du festival</h1>
          <p className="text-sm text-muted-foreground mt-1">{ateliers?.length ?? 0} ateliers</p>
        </div>
        <button type="button" className="px-4 py-2 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors text-sm">
          + Ajouter
        </button>
      </header>

      {/*
        TODO : CRUD complet
        - Champs : titre, description, sport_id, association_id, horaire_debut/fin, lieu, capacite_max, public_cible, code_stand, actif
        - Génération automatique du code_stand (6 majuscules aléatoires, unique)
        - Vue programme du jour J avec timeline visuelle
      */}
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Titre</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Horaire</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Code stand</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Sport / Asso</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ateliers?.map((atelier) => (
              <tr key={atelier.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{atelier.titre}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {formatDateTime(atelier.horaire_debut)} → {formatDateTime(atelier.horaire_fin)}
                </td>
                <td className="px-4 py-3">
                  <code className="px-2 py-0.5 rounded bg-muted font-mono text-xs">{atelier.code_stand}</code>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {(atelier.sports as { nom: string } | null)?.nom ?? '—'}
                  {(atelier.associations as { nom: string } | null)?.nom && (
                    <span className="ml-1 text-muted-foreground/60">· {(atelier.associations as { nom: string }).nom}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Modifier</button>
                    <button type="button" className="text-xs text-destructive hover:opacity-80 transition-opacity">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
