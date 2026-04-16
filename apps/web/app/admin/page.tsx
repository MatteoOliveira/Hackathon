import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

// P19 — Dashboard admin
export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false },
};

interface Stat {
  label: string;
  value: number | string;
  icon: string;
  description?: string;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Requêtes parallèles
  const [
    { count: nbInscriptions },
    { count: nbCheckins },
    { count: nbAssociations },
    { count: nbMessages },
  ] = await Promise.all([
    supabase.from('inscriptions').select('*', { count: 'exact', head: true }),
    supabase.from('checkins').select('*', { count: 'exact', head: true }),
    supabase.from('associations').select('*', { count: 'exact', head: true }).eq('actif', true),
    supabase.from('messages_contact').select('*', { count: 'exact', head: true }).eq('traite', false),
  ]);

  const stats: Stat[] = [
    { icon: '📝', label: 'Inscriptions', value: nbInscriptions ?? 0 },
    { icon: '✅', label: 'Check-ins passeport', value: nbCheckins ?? 0 },
    { icon: '🏢', label: 'Associations actives', value: nbAssociations ?? 0 },
    { icon: '📬', label: 'Messages non traités', value: nbMessages ?? 0, description: 'À traiter' },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Solimouv&apos; 2026 · Vue temps réel</p>
      </header>

      {/* Statistiques clés */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Statistiques clés</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-background rounded-xl border border-border p-6">
              <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span aria-hidden>{stat.icon}</span>
                {stat.label}
              </dt>
              <dd className="mt-2 text-4xl font-extrabold text-foreground">{stat.value}</dd>
              {stat.description && (
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
              )}
            </div>
          ))}
        </dl>
      </section>

      {/* TODO : graphique horaire check-ins (recharts ou chart.js) */}
      <section aria-labelledby="chart-heading" className="bg-background rounded-xl border border-border p-6 mb-8">
        <h2 id="chart-heading" className="text-lg font-semibold mb-4">Check-ins par heure</h2>
        <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
          Graphique à implémenter (recharts / chart.js)
        </div>
      </section>

      {/* TODO : top stands / paliers débloqués */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-background rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Top stands visités</h2>
          <p className="text-sm text-muted-foreground">À implémenter via /api/admin/stats</p>
        </section>
        <section className="bg-background rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Paliers débloqués</h2>
          <p className="text-sm text-muted-foreground">Répartition bronze/argent/or/platine</p>
        </section>
      </div>
    </div>
  );
}
