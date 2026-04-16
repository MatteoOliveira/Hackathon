import type { Metadata } from 'next';
import Link from 'next/link';

// P01 — Accueil
export const metadata: Metadata = {
  title: "Solimouv' — Festival du sport inclusif 2026",
  description:
    "Rejoignez le festival du sport pour toutes et tous le 11 juillet 2026 à Paris. Ateliers sportifs, associations partenaires, matching sport & profil.",
  openGraph: {
    title: "Solimouv' 2026 — Festival du sport inclusif",
    description: "11 juillet 2026 · Centre Sportif Charles Moureu, Paris",
    images: ['/og/home.png'],
  },
};

// JSON-LD Schema.org SportsEvent
function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SportsEvent',
          name: "Solimouv' 2026",
          startDate: '2026-07-11T10:00:00+02:00',
          endDate: '2026-07-11T18:00:00+02:00',
          location: {
            '@type': 'Place',
            name: 'Centre Sportif Charles Moureu',
            address: { '@type': 'PostalAddress', addressLocality: 'Paris', addressCountry: 'FR' },
          },
          organizer: {
            '@type': 'Organization',
            name: 'Up Sport!',
            url: 'https://www.unispourlesport.paris/',
          },
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
          isAccessibleForFree: true,
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          eventStatus: 'https://schema.org/EventScheduled',
        }),
      }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <main id="main-content">
        {/* ── Hero ── */}
        <section
          aria-labelledby="hero-heading"
          className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-dark text-white"
        >
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-24 md:py-36">
            <div className="max-w-2xl">
              <p className="text-brand-light font-semibold text-sm uppercase tracking-widest mb-4">
                11 juillet 2026 · Paris
              </p>
              <h1 id="hero-heading" className="text-4xl sm:text-6xl font-extrabold leading-tight">
                Le sport pour{' '}
                <span className="text-accent">toutes et tous</span>
              </h1>
              <p className="mt-6 text-lg text-white/80 max-w-xl">
                Venez découvrir 13 associations sportives parisiennes, tester de nouvelles activités
                et trouver le sport qui vous correspond — quel que soit votre niveau ou vos besoins.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/inscription"
                  className="inline-flex items-center px-6 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent-dark transition-colors text-base"
                >
                  Je m&apos;inscris gratuitement
                </Link>
                <Link
                  href="/programme"
                  className="inline-flex items-center px-6 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-base"
                >
                  Voir le programme
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Compte à rebours ── */}
        {/* TODO : implémenter le composant CountdownTimer côté client */}
        <section aria-label="Compte à rebours" className="bg-muted py-12">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-4">
              Ouverture dans
            </p>
            <div className="flex justify-center gap-6" id="countdown">
              {/* CountdownTimer — composant client à implémenter */}
              <div className="text-center">
                <span className="text-5xl font-bold text-brand">--</span>
                <p className="text-xs text-muted-foreground mt-1">Jours</p>
              </div>
              <div className="text-center">
                <span className="text-5xl font-bold text-brand">--</span>
                <p className="text-xs text-muted-foreground mt-1">Heures</p>
              </div>
              <div className="text-center">
                <span className="text-5xl font-bold text-brand">--</span>
                <p className="text-xs text-muted-foreground mt-1">Minutes</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Chiffres clés ── */}
        <section aria-labelledby="stats-heading" className="py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <h2 id="stats-heading" className="sr-only">Solimouv&apos; en chiffres</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {[
                { value: '+500', label: 'Participants édition 1' },
                { value: '13', label: 'Associations partenaires' },
                { value: '40', label: 'Bénévoles' },
                { value: '100%', label: 'Gratuit & inclusif' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <dt className="text-4xl font-extrabold text-brand">{value}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Teaser associations ── */}
        <section aria-labelledby="assos-heading" className="py-16 bg-muted/50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <h2 id="assos-heading" className="text-2xl font-bold text-center mb-2">
              13 associations à découvrir
            </h2>
            <p className="text-muted-foreground text-center mb-10">
              Des structures parisiennes engagées pour rendre le sport accessible à tous.
            </p>
            {/* TODO : grille des associations chargée depuis Supabase */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-background border border-border animate-pulse" />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/associations"
                className="inline-flex items-center px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
              >
                Toutes les associations
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA matching ── */}
        <section aria-labelledby="matching-cta-heading" className="py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="rounded-2xl bg-brand p-8 sm:p-12 text-white text-center">
              <h2 id="matching-cta-heading" className="text-3xl font-bold">
                Quel sport est fait pour vous ?
              </h2>
              <p className="mt-3 text-white/80 max-w-xl mx-auto">
                Répondez à quelques questions et notre algorithme vous recommande les activités
                les plus adaptées à votre profil.
              </p>
              <Link
                href="/inscription"
                className="mt-6 inline-flex items-center px-6 py-3 bg-white text-brand font-bold rounded-lg hover:bg-white/90 transition-colors"
              >
                Trouver mon sport
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
