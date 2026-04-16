import type { Metadata } from 'next';

// P10 — Passeport sportif
export const metadata: Metadata = {
  title: 'Mon passeport sportif',
  description:
    "Collectez des codes à chaque stand du festival Solimouv' 2026 et débloquez vos badges Bronze, Argent, Or et Platine.",
};

const PALIERS = [
  { nom: 'Bronze', seuil: 3, couleur: '#CD7F32', emoji: '🥉' },
  { nom: 'Argent', seuil: 6, couleur: '#C0C0C0', emoji: '🥈' },
  { nom: 'Or', seuil: 10, couleur: '#FFD700', emoji: '🥇' },
  { nom: 'Platine', seuil: 13, couleur: '#E5E4E2', emoji: '🏆' },
];

export default function PasseportPage() {
  return (
    <main id="main-content" className="py-12">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6">
        <header className="mb-10 text-center">
          <p className="text-5xl mb-4" aria-hidden>🎫</p>
          <h1 className="text-4xl font-extrabold">Mon passeport sportif</h1>
          <p className="mt-3 text-muted-foreground">
            Visitez les stands, entrez les codes et débloquez vos badges !
          </p>
        </header>

        {/* Progression */}
        <section aria-labelledby="progress-heading" className="mb-10">
          <h2 id="progress-heading" className="text-lg font-semibold mb-4">Ma progression</h2>
          {/* TODO : charger depuis localStorage (anonyme) ou Supabase (connecté) */}
          <div className="rounded-xl border border-border p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-foreground">0 / 13 stands visités</span>
              <span className="text-sm text-muted-foreground">0%</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={0}
              aria-valuemin={0}
              aria-valuemax={13}
              aria-label="Progression du passeport"
              className="h-3 rounded-full bg-muted overflow-hidden"
            >
              <div className="h-full bg-brand rounded-full" style={{ width: '0%' }} />
            </div>
          </div>
        </section>

        {/* Paliers */}
        <section aria-labelledby="paliers-heading" className="mb-10">
          <h2 id="paliers-heading" className="text-lg font-semibold mb-4">Paliers</h2>
          <ol className="space-y-3">
            {PALIERS.map((palier) => (
              <li
                key={palier.nom}
                className="flex items-center gap-4 p-4 rounded-xl border border-border"
              >
                <span className="text-2xl" aria-hidden>{palier.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{palier.nom}</p>
                  <p className="text-sm text-muted-foreground">{palier.seuil} stands visités</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  Verrouillé
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Saisie de code */}
        <section aria-labelledby="code-heading">
          <h2 id="code-heading" className="text-lg font-semibold mb-4">Scanner un stand</h2>
          {/*
            TODO : formulaire de saisie du code stand
            - Input code (6 caractères majuscules)
            - Validation via POST /api/checkin
            - Feedback visuel succès / erreur
            - Animation déblocage de palier si seuil atteint
          */}
          <div className="rounded-xl border border-dashed border-brand/30 bg-brand/5 p-8 text-center text-muted-foreground">
            <p className="text-3xl mb-3" aria-hidden>📷</p>
            <p className="font-medium">Saisie de code à implémenter</p>
            <p className="text-sm mt-1">Formulaire + appel POST /api/checkin</p>
          </div>
        </section>
      </div>
    </main>
  );
}
