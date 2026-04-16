import type { Metadata } from 'next';

// P30 — Politique de confidentialité (obligatoire RGPD)
export const metadata: Metadata = {
  title: 'Politique de confidentialité',
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main id="main-content" className="py-12">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold mb-2">Politique de confidentialité</h1>
        <p className="text-sm text-muted-foreground mb-8">Dernière mise à jour : {new Date().getFullYear()}</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Responsable du traitement</h2>
            <p>Up Sport! — <a href="mailto:contact@solimouv.app" className="text-brand hover:underline">contact@solimouv.app</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Données collectées</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Prénom, adresse email (inscription au festival ou création de compte)</li>
              <li>Tranche d&apos;âge, centres d&apos;intérêt, besoins d&apos;accessibilité (optionnel)</li>
              <li>Codes de stands scannés lors du festival</li>
              <li>Données de navigation (cookies techniques uniquement)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Finalités du traitement</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Gestion des inscriptions au festival</li>
              <li>Recommandation personnalisée de sports (matching)</li>
              <li>Suivi du passeport sportif</li>
              <li>Envoi de notifications si consentement explicite</li>
              <li>Amélioration du service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Base légale</h2>
            <p>Le traitement repose sur le consentement de l&apos;utilisateur (Art. 6.1.a RGPD) et l&apos;exécution contractuelle.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Durée de conservation</h2>
            <p>Les données sont conservées 3 ans après la dernière activité, puis supprimées ou anonymisées.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement,
              de portabilité et d&apos;opposition. Pour exercer ces droits, contactez-nous à{' '}
              <a href="mailto:contact@solimouv.app" className="text-brand hover:underline">contact@solimouv.app</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Sous-traitants</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Supabase</strong> (base de données et authentification) — UE/US</li>
              <li><strong>Vercel</strong> (hébergement) — US</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
