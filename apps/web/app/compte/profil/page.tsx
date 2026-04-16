import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

// P16 — Mon profil
export const metadata: Metadata = {
  title: 'Mon profil',
  robots: { index: false },
};

const TRANCHES_AGE = ['<18', '18-25', '26-40', '41-60', '60+'];
const CENTRES_INTERET = ['collectif', 'individuel', 'plein_air', 'interieur', 'aquatique', 'combat', 'danse', 'force', 'endurance'];
const BESOINS_ACCESSIBILITE = ['fauteuil_roulant', 'deficience_visuelle', 'deficience_auditive', 'mobilite_reduite'];

export default async function ProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold">Mon profil</h1>
        <p className="mt-1 text-muted-foreground">
          Vos informations personnelles et préférences sportives.
        </p>
      </header>

      {/*
        TODO : formulaire d'édition avec react-hook-form + zod
        - Server Action : supabase.from('profiles').update(...).eq('id', user.id)
        - Feedback toast succès / erreur
      */}
      <form className="space-y-6" aria-label="Formulaire de mise à jour du profil">
        {/* Informations personnelles */}
        <section aria-labelledby="infos-heading">
          <h2 id="infos-heading" className="text-lg font-semibold mb-4 pb-2 border-b border-border">
            Informations personnelles
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium mb-1">Prénom</label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                defaultValue={profile?.prenom ?? ''}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={user?.email ?? ''}
                disabled
                className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-muted-foreground">L&apos;email ne peut pas être modifié ici.</p>
            </div>
            <div>
              <label htmlFor="tranche_age" className="block text-sm font-medium mb-1">Tranche d&apos;âge</label>
              <select
                id="tranche_age"
                name="tranche_age"
                defaultValue={profile?.tranche_age ?? ''}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="">Non renseigné</option>
                {TRANCHES_AGE.map((t) => (
                  <option key={t} value={t}>{t} ans</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Centres d'intérêt sportifs */}
        <section aria-labelledby="interets-heading">
          <h2 id="interets-heading" className="text-lg font-semibold mb-4 pb-2 border-b border-border">
            Centres d&apos;intérêt sportifs
          </h2>
          <fieldset>
            <legend className="sr-only">Sélectionnez vos centres d&apos;intérêt</legend>
            <div className="flex flex-wrap gap-3">
              {CENTRES_INTERET.map((interet) => (
                <label key={interet} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="centres_interet"
                    value={interet}
                    defaultChecked={profile?.centres_interet?.includes(interet)}
                    className="h-4 w-4 rounded border-border text-brand focus:ring-brand"
                  />
                  <span className="text-sm capitalize">{interet.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        {/* Besoins d'accessibilité */}
        <section aria-labelledby="accessibilite-heading">
          <h2 id="accessibilite-heading" className="text-lg font-semibold mb-4 pb-2 border-b border-border">
            Besoins d&apos;accessibilité
          </h2>
          <fieldset>
            <legend className="sr-only">Sélectionnez vos besoins d&apos;accessibilité</legend>
            <div className="space-y-2">
              {BESOINS_ACCESSIBILITE.map((besoin) => (
                <label key={besoin} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="besoins_accessibilite"
                    value={besoin}
                    defaultChecked={profile?.besoins_accessibilite?.includes(besoin)}
                    className="h-4 w-4 rounded border-border text-brand focus:ring-brand"
                  />
                  <span className="text-sm capitalize">{besoin.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        {/* Notifications */}
        <section aria-labelledby="notifs-heading">
          <h2 id="notifs-heading" className="text-lg font-semibold mb-4 pb-2 border-b border-border">
            Notifications
          </h2>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="consent_notifs"
              defaultChecked={profile?.consent_notifs ?? false}
              className="mt-1 h-4 w-4 rounded border-border text-brand focus:ring-brand"
            />
            <span className="text-sm text-muted-foreground">
              Recevoir des notifications personnalisées selon mon profil (rappels programme, nouveaux sports).
            </span>
          </label>
        </section>

        <button
          type="submit"
          className="px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
