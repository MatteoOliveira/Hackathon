import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

// P23 — Liste des inscriptions
export const metadata: Metadata = {
  title: 'Inscriptions — Admin',
  robots: { index: false },
};

export default async function AdminInscriptionsPage() {
  const supabase = await createClient();
  const { data: inscriptions, count } = await supabase
    .from('inscriptions')
    .select('*, checkins(count)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold">Inscriptions</h1>
          <p className="text-sm text-muted-foreground mt-1">{count ?? 0} inscrits au total</p>
        </div>
        {/* TODO : export CSV */}
        <button type="button" className="px-4 py-2 border border-border text-sm font-semibold rounded-lg hover:bg-muted transition-colors">
          ↓ Export CSV
        </button>
      </header>

      {/* TODO : barre de recherche + filtres (tranche d'âge, source, consent_notifs) */}
      <div className="mb-4 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
        Recherche et filtres à implémenter
      </div>

      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Prénom</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Email</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Âge</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Stands</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Notifs</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Source</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {inscriptions?.map((ins) => (
              <tr key={ins.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{ins.prenom}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{ins.email ?? '(compte)'}</td>
                <td className="px-4 py-3 text-muted-foreground">{ins.tranche_age ?? '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {(ins.checkins as unknown as { count: number }[])?.[0]?.count ?? 0} / 13
                </td>
                <td className="px-4 py-3">
                  {ins.consent_notifs ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Oui</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Non</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{ins.source}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(ins.created_at).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
