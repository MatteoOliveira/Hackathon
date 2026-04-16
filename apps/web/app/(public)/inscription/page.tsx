import type { Metadata } from 'next';

// P09 — Inscription festival + Matching sport
export const metadata: Metadata = {
  title: 'Inscription & Matching sport',
  description:
    "Inscrivez-vous au festival Solimouv' 2026 et découvrez quels sports correspondent le mieux à votre profil grâce à notre algorithme de matching.",
};

export default function InscriptionPage() {
  return (
    <main id="main-content" className="py-12">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold">Trouvez votre sport</h1>
          <p className="mt-3 text-muted-foreground text-lg">
            Répondez à quelques questions et inscrivez-vous au festival.
            Notre algorithme vous recommandera les sports les plus adaptés à votre profil.
          </p>
        </header>

        {/* Étapes */}
        <ol aria-label="Étapes du formulaire" className="flex items-center justify-center gap-4 mb-10">
          {['Votre profil', 'Vos préférences', 'Résultats'].map((etape, i) => (
            <li key={etape} className="flex items-center gap-2 text-sm">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  i === 0 ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'
                }`}
                aria-current={i === 0 ? 'step' : undefined}
              >
                {i + 1}
              </span>
              <span className={i === 0 ? 'font-medium' : 'text-muted-foreground'}>{etape}</span>
              {i < 2 && <span aria-hidden className="text-border">→</span>}
            </li>
          ))}
        </ol>

        {/*
          TODO : implémenter le formulaire multi-étapes avec :
          - react-hook-form + zod
          - Étape 1 : prénom, tranche d'âge, email (optionnel si pas de compte), consent_notifs
          - Étape 2 : centres d'intérêt (checkboxes), besoins accessibilité, préférence intensité (slider 1-5), préférence collectif/individuel
          - Étape 3 : appel WASM (compute_matching) → affichage top 3 sports + CTA inscription
          - Enregistrement dans la table `inscriptions` via Server Action ou /api/matching
        */}

        <div className="rounded-xl border border-dashed border-brand/30 bg-brand/5 p-10 text-center text-muted-foreground">
          <p className="text-4xl mb-4" aria-hidden>🧩</p>
          <p className="font-medium">Formulaire de matching</p>
          <p className="text-sm mt-1">
            Formulaire multi-étapes + algorithme Rust/WASM à implémenter.
          </p>
        </div>
      </div>
    </main>
  );
}
