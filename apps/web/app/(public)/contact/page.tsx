import type { Metadata } from 'next';

// P08 — Contact
export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Contactez l'équipe Up Sport! pour toute question sur le festival Solimouv' 2026 : partenariats, bénévolat, presse.",
};

export default function ContactPage() {
  return (
    <main id="main-content" className="py-12">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold">Contact</h1>
          <p className="mt-2 text-muted-foreground">
            Une question ? Une envie de s&apos;impliquer ? On est là.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Formulaire */}
          <section aria-labelledby="form-heading">
            <h2 id="form-heading" className="text-xl font-bold mb-6">Nous écrire</h2>

            {/* TODO : remplacer par un formulaire react-hook-form + zod + Server Action */}
            <form
              className="space-y-4"
              aria-label="Formulaire de contact"
            >
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-foreground mb-1">
                  Nom <span aria-label="requis" className="text-destructive">*</span>
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Email <span aria-label="requis" className="text-destructive">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label htmlFor="sujet" className="block text-sm font-medium text-foreground mb-1">
                  Sujet
                </label>
                <select
                  id="sujet"
                  name="sujet"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="">Sélectionner…</option>
                  <option value="partenariat">Partenariat association</option>
                  <option value="benevolat">Bénévolat</option>
                  <option value="presse">Presse / Médias</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                  Message <span aria-label="requis" className="text-destructive">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
              >
                Envoyer le message
              </button>
            </form>
          </section>

          {/* Infos de contact */}
          <section aria-labelledby="infos-heading">
            <h2 id="infos-heading" className="text-xl font-bold mb-6">Up Sport!</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-medium text-foreground">Adresse</dt>
                <dd className="mt-1 text-muted-foreground">
                  Centre Sportif Charles Moureu<br />
                  Paris (13ᵉ arrondissement)
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Site web</dt>
                <dd className="mt-1">
                  <a
                    href="https://www.unispourlesport.paris/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline"
                  >
                    unispourlesport.paris ↗
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-8 p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                Pour les demandes urgentes, consultez aussi nos réseaux sociaux.
                {/* TODO : liens réseaux sociaux */}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
