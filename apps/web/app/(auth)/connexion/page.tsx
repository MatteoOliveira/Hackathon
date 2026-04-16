import type { Metadata } from 'next';
import Link from 'next/link';

// P12 — Connexion
export const metadata: Metadata = {
  title: 'Connexion',
  robots: { index: false },
};

export default function ConnexionPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Se connecter</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Accédez à votre espace personnel Solimouv&apos;
        </p>
      </div>

      {/*
        TODO : implémenter avec Supabase Auth
        - Form avec react-hook-form + zod
        - Server Action : supabase.auth.signInWithPassword
        - Gestion d'erreur (credentials invalides)
        - Redirect vers /compte après succès (ou vers ?redirect= si paramètre)
      */}
      <form className="space-y-4" aria-label="Formulaire de connexion">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="vous@exemple.fr"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Mot de passe
            </label>
            <Link href="/mot-de-passe-oublie" className="text-xs text-brand hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 px-6 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
        >
          Se connecter
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{' '}
        <Link href="/inscription-compte" className="text-brand font-medium hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
