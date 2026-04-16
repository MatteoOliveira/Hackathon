import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

// P21 — CRUD Sports
export const metadata: Metadata = {
  title: 'Sports — Admin',
  robots: { index: false },
};

export default async function AdminSportsPage() {
  const supabase = await createClient();
  const { data: sports } = await supabase
    .from('sports')
    .select('*')
    .order('nom', { ascending: true });

  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold">Sports</h1>
          <p className="text-sm text-muted-foreground mt-1">{sports?.length ?? 0} sports</p>
        </div>
        <button type="button" className="px-4 py-2 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors text-sm">
          + Ajouter
        </button>
      </header>

      {/*
        TODO : CRUD complet
        - Champs : nom, slug, description, niveau_requis, materiel_requis, accessibilite_handicap,
          accessibilite_debutant, intensite (1-5), type_activite, tags (important pour le matching), icon, image_url
        - Tags matching : interface de tag input pour gérer les tags utilisés par l'algo Rust
        - Association sport ↔ associations (table sport_associations)
      */}
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Nom</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Niveau</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Intensité</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Accessibilité</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sports?.map((sport) => (
              <tr key={sport.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">
                  {sport.icon && <span className="mr-2" aria-hidden>{sport.icon}</span>}
                  {sport.nom}
                </td>
                <td className="px-4 py-3 text-muted-foreground capitalize">{sport.niveau_requis}</td>
                <td className="px-4 py-3 text-muted-foreground">{sport.intensite ?? '—'}/5</td>
                <td className="px-4 py-3">
                  {sport.accessibilite_handicap && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">♿</span>
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
