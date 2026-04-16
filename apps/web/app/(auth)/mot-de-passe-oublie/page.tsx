import type { Metadata } from 'next';
import Link from 'next/link';

// P14 — Réinitialisation du mot de passe
export const metadata: Metadata = {
  title: 'Mot de passe oublié',
  robots: { index: false },
};

export default function MotDePasseOubliePage() {
  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Mot de passe oublié</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Entrez votre email et nous vous enverrons un lien de réinitialisation.
        </p>
      </div>

      {/*
        TODO : supabase.auth.resetPasswordForEmail(email, { redirectTo: siteUrl + '/compte/reset-password' })
      */}
      <form className="space-y-4" aria-label="Formulaire de réinitialisation du mot de passe">
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
        <button
          type="submit"
          className="w-full py-3 px-6 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
        >
          Envoyer le lien
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/connexion" className="text-brand hover:underline">
          ← Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
