import type { Metadata } from 'next';

// P02 — À propos
export const metadata: Metadata = {
  title: 'À propos',
  description:
    "Découvrez Up Sport! et le festival Solimouv' : mission, valeurs, histoire et équipe. Un festival du sport inclusif organisé à Paris.",
};

export default function AProposPage() {
  return (
    <main id="main-content" className="py-12">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        {/* En-tête */}
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-foreground">À propos</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Un festival né d&apos;une conviction simple : le sport est pour tout le monde.
          </p>
        </header>

        {/* Up Sport! */}
        <section aria-labelledby="upsport-heading" className="mb-16">
          <h2 id="upsport-heading" className="text-2xl font-bold mb-4">Up Sport!</h2>
          <p className="text-muted-foreground leading-relaxed">
            Up Sport! est un collectif d&apos;associations parisiennes engagées pour rendre le sport
            accessible à toutes et tous, quels que soient l&apos;âge, le handicap, ou le niveau de
            pratique. Chaque semaine, nos associations accompagnent plus de 250 personnes vers une
            pratique sportive épanouissante.
          </p>
          {/* TODO : 4 programmes détaillés */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '♿', titre: 'Sport & Handicap', desc: 'Activités adaptées pour les personnes en situation de handicap' },
              { icon: '👴', titre: 'Sport & Séniors', desc: 'Maintien de la forme et du lien social pour les plus de 60 ans' },
              { icon: '👶', titre: 'Sport & Jeunesse', desc: 'Initiation sportive pour les moins de 18 ans des quartiers populaires' },
              { icon: '🤝', titre: 'Sport & Inclusion', desc: 'Activités mixtes qui mêlent valides et personnes handicapées' },
            ].map(({ icon, titre, desc }) => (
              <article key={titre} className="rounded-xl border border-border p-6">
                <p className="text-3xl mb-3" aria-hidden>{icon}</p>
                <h3 className="font-semibold text-foreground">{titre}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Solimouv' */}
        <section aria-labelledby="solimouv-heading" className="mb-16">
          <h2 id="solimouv-heading" className="text-2xl font-bold mb-4">Solimouv&apos;</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            La 1ʳᵉ édition de Solimouv&apos; s&apos;est tenue le 12 juillet 2025 au Centre Sportif Charles
            Moureu (Paris 13ᵉ). Elle a réuni plus de 500 participants, 13 associations partenaires
            et 40 bénévoles pour une journée de sport, de rencontres et de découvertes.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            La 2ᵉ édition aura lieu le <strong>11 juillet 2026</strong>, avec l&apos;ambition de
            doubler la participation et d&apos;accueillir de nouvelles associations.
          </p>
        </section>

        {/* Valeurs */}
        <section aria-labelledby="valeurs-heading">
          <h2 id="valeurs-heading" className="text-2xl font-bold mb-6">Nos valeurs</h2>
          <ul className="space-y-4">
            {[
              { emoji: '🌈', valeur: 'Inclusion', desc: 'Chaque personne mérite de trouver sa place dans le sport.' },
              { emoji: '🤲', valeur: 'Accessibilité', desc: 'Aucun obstacle physique, financier ou social ne doit empêcher la pratique.' },
              { emoji: '🤸', valeur: 'Découverte', desc: 'Le festival est une invitation à tester des sports que l\'on ne connaît pas encore.' },
              { emoji: '💬', valeur: 'Communauté', desc: 'Le sport crée du lien. Solimouv\' réunit Paris autour d\'un projet commun.' },
            ].map(({ emoji, valeur, desc }) => (
              <li key={valeur} className="flex gap-4 items-start">
                <span className="text-2xl mt-0.5" aria-hidden>{emoji}</span>
                <div>
                  <p className="font-semibold text-foreground">{valeur}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
