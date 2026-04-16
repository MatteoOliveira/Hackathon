import type { Metadata } from 'next';

// P31 — Déclaration d'accessibilité
export const metadata: Metadata = {
  title: 'Accessibilité',
};

export default function AccessibilitePage() {
  return (
    <main id="main-content" className="py-12">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold mb-2">Déclaration d&apos;accessibilité</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Solimouv&apos; s&apos;engage à rendre son site web accessible conformément à la loi française et
          aux normes WCAG 2.1 niveau AA.
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">État de conformité</h2>
            <p>
              Le site est <strong>partiellement conforme</strong> aux normes WCAG 2.1 niveau AA.
              Des audits réguliers sont réalisés pour améliorer l&apos;accessibilité.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Mesures prises</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Navigation 100% clavier avec focus visible</li>
              <li>Contrastes texte ≥ 4.5:1 (normal) et ≥ 3:1 (large)</li>
              <li>Texte alternatif sur toutes les images non décoratives</li>
              <li>Structure sémantique HTML5 avec hiérarchie des titres respectée</li>
              <li>Lien d&apos;évitement vers le contenu principal</li>
              <li>Respect de <code>prefers-reduced-motion</code></li>
              <li>Labels explicites sur tous les champs de formulaire</li>
              <li>Zones de clic ≥ 44×44 px sur mobile</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Technologies d&apos;assistance testées</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>VoiceOver (macOS 14 + Safari)</li>
              <li>VoiceOver (iOS 17 + Safari)</li>
              <li>NVDA (Windows + Firefox)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Signaler un problème</h2>
            <p>
              Si vous rencontrez un obstacle d&apos;accessibilité, contactez-nous à{' '}
              <a href="mailto:contact@solimouv.app" className="text-brand hover:underline">contact@solimouv.app</a>.
              Nous nous engageons à répondre dans les 5 jours ouvrés.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
