import type { Metadata } from 'next';
import Link from 'next/link';

// P13 — Création de compte
export const metadata: Metadata = {
  title: 'Créer un compte',
  robots: { index: false },
};

export default function InscriptionComptePage() {
  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Créer un compte</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Suivez votre passeport sportif et vos recommandations sur tous vos appareils.
        </p>
      </div>

      {/*
        TODO : implémenter avec Supabase Auth
        - supabase.auth.signUp avec metadata (prenom)
        - Le trigger handle_new_user crée automatiquement le profil
        - Redirect vers /compte après confirmation email
      */}
      <form className="space-y-4" aria-label="Formulaire de création de compte">
        <div>
          <label htmlFor="prenom" className="block text-sm font-medium text-foreground mb-1">
            Prénom <span aria-label="requis" className="text-destructive">*</span>
          </label>
          <input
            id="prenom"
            name="prenom"
            type="text"
            required
            autoComplete="given-name"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Votre prénom"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            Adresse email <span aria-label="requis" className="text-destructive">*</span>
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
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
            Mot de passe <span aria-label="requis" className="text-destructive">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="8 caractères minimum"
          />
        </div>
        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-border text-brand focus:ring-brand"
          />
          <label htmlFor="consent" className="text-xs text-muted-foreground">
            J&apos;accepte la{' '}
            <Link href="/politique-confidentialite" className="text-brand hover:underline">
              politique de confidentialité
            </Link>{' '}
            et le traitement de mes données personnelles.
          </label>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-6 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
        >
          Créer mon compte
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Déjà un compte ?{' '}
        <Link href="/connexion" className="text-brand font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
