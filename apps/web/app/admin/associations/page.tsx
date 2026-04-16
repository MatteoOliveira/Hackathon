import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

// P20 — CRUD Associations
export const metadata: Metadata = {
  title: 'Associations — Admin',
  robots: { index: false },
};

export default async function AdminAssociationsPage() {
  const supabase = await createClient();
  const { data: associations } = await supabase
    .from('associations')
    .select('*')
    .order('ordre_affichage', { ascending: true });

  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold">Associations</h1>
          <p className="text-sm text-muted-foreground mt-1">{associations?.length ?? 0} associations</p>
        </div>
        {/* TODO : bouton créer → modal ou page /admin/associations/new */}
        <button
          type="button"
          className="px-4 py-2 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors text-sm"
        >
          + Ajouter
        </button>
      </header>

      {/*
        TODO : implémenter CRUD complet
        - Liste avec drag-and-drop pour ordre_affichage
        - Modale d'édition (nom, slug, description, logo, site_web, contact_email, couleur_theme, actif)
        - Confirmation de suppression
        - Upload logo vers Supabase Storage
      */}
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Nom</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Slug</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Statut</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {associations?.map((asso) => (
              <tr key={asso.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{asso.nom}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{asso.slug}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    asso.actif ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                  }`}>
                    {asso.actif ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/associations/${asso.slug}`}
                      target="_blank"
                      className="text-brand hover:underline text-xs"
                    >
                      Voir ↗
                    </Link>
                    <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Modifier
                    </button>
                    <button type="button" className="text-xs text-destructive hover:opacity-80 transition-opacity">
                      Supprimer
                    </button>
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
