import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

// P25 — Paramètres globaux
export const metadata: Metadata = {
  title: 'Paramètres — Admin',
  robots: { index: false },
};

export default async function AdminConfigPage() {
  const supabase = await createClient();
  const { data: configs } = await supabase
    .from('config')
    .select('*')
    .order('key', { ascending: true });

  const configMap = Object.fromEntries(configs?.map((c) => [c.key, c.value]) ?? []);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold">Paramètres globaux</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configuration de l&apos;édition courante. Chaque modification est immédiatement visible sur le site.
        </p>
      </header>

      {/*
        TODO : formulaire d'édition par clé
        - Server Action : supabase.from('config').upsert({ key, value, updated_at: new Date() })
        - Valider avec zod selon le type de chaque clé
      */}
      <form className="space-y-6 max-w-xl" aria-label="Formulaire de configuration">
        {/* Date du festival */}
        <div>
          <label htmlFor="date_festival" className="block text-sm font-medium mb-1">
            Date du festival
          </label>
          <input
            id="date_festival"
            name="date_festival"
            type="datetime-local"
            defaultValue={(configMap.date_festival as string | undefined)?.replace(/"/g, '') ?? '2026-07-11T10:00:00'}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        {/* Lieu */}
        <div>
          <label htmlFor="lieu_festival" className="block text-sm font-medium mb-1">
            Lieu du festival
          </label>
          <input
            id="lieu_festival"
            name="lieu_festival"
            type="text"
            defaultValue={(configMap.lieu_festival as string | undefined)?.replace(/"/g, '') ?? ''}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        {/* Festival actif */}
        <div className="flex items-center gap-3">
          <input
            id="festival_actif"
            name="festival_actif"
            type="checkbox"
            defaultChecked={configMap.festival_actif === true || configMap.festival_actif === 'true'}
            className="h-4 w-4 rounded border-border text-brand focus:ring-brand"
          />
          <label htmlFor="festival_actif" className="text-sm font-medium">
            Festival actif (désactiver pour passer en mode maintenance)
          </label>
        </div>

        {/* Paliers passeport */}
        <section aria-labelledby="paliers-heading">
          <h2 id="paliers-heading" className="text-sm font-semibold mb-3">Seuils des paliers passeport</h2>
          <div className="grid grid-cols-2 gap-4">
            {(['bronze', 'argent', 'or', 'platine'] as const).map((palier) => {
              const paliers = configMap.paliers_passeport as Record<string, number> | undefined;
              return (
                <div key={palier}>
                  <label htmlFor={`palier_${palier}`} className="block text-sm capitalize mb-1">
                    {palier}
                  </label>
                  <input
                    id={`palier_${palier}`}
                    name={`palier_${palier}`}
                    type="number"
                    min={1}
                    max={13}
                    defaultValue={paliers?.[palier] ?? 0}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              );
            })}
          </div>
        </section>

        <button
          type="submit"
          className="px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
        >
          Enregistrer les paramètres
        </button>
      </form>

      {/* Vue brute de la config */}
      <details className="mt-12">
        <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          Vue technique (JSON brut)
        </summary>
        <pre className="mt-4 p-4 rounded-xl bg-muted text-xs overflow-auto">
          {JSON.stringify(configMap, null, 2)}
        </pre>
      </details>
    </div>
  );
}
