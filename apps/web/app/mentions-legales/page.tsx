import type { Metadata } from 'next';

// P29 — Mentions légales (obligatoire LCEN)
export const metadata: Metadata = {
  title: 'Mentions légales',
};

export default function MentionsLegalesPage() {
  return (
    <main id="main-content" className="py-12">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 prose prose-neutral dark:prose-invert max-w-none">
        <h1>Mentions légales</h1>
        <p className="text-muted-foreground text-sm">Dernière mise à jour : {new Date().getFullYear()}</p>

        <h2>Éditeur du site</h2>
        <p>
          <strong>Up Sport!</strong><br />
          Association loi 1901<br />
          Siège social : Centre Sportif Charles Moureu, Paris<br />
          Email : <a href="mailto:contact@solimouv.app">contact@solimouv.app</a>
        </p>

        <h2>Hébergement</h2>
        <p>
          Ce site est hébergé par <strong>Vercel Inc.</strong>, 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
        </p>

        <h2>Directeur de la publication</h2>
        <p>Le directeur de la publication est le représentant légal de l&apos;association Up Sport!.</p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus présents sur ce site (textes, images, logos) est protégé par le droit
          d&apos;auteur et appartient à Up Sport! ou à ses partenaires. Toute reproduction est interdite
          sans accord préalable.
        </p>

        <h2>Limitation de responsabilité</h2>
        <p>
          Up Sport! s&apos;efforce de fournir des informations exactes et à jour. Toutefois, elle ne peut
          garantir l&apos;exactitude, la complétude ou l&apos;actualité des informations présentes sur ce site.
        </p>

        <h2>Liens hypertextes</h2>
        <p>
          Ce site peut contenir des liens vers des sites tiers. Up Sport! n&apos;est pas responsable du
          contenu de ces sites.
        </p>
      </div>
    </main>
  );
}
