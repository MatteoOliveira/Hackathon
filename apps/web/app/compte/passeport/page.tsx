import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

// P17 — Mon passeport (version synchronisée, utilisateur connecté)
export const metadata: Metadata = {
  title: 'Mon passeport sportif',
  robots: { index: false },
};

export default async function ComptePasseportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Récupère l'inscription principale de l'utilisateur
  const { data: inscription } = await supabase
    .from('inscriptions')
    .select('id, sports_recommandes')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Récupère les check-ins si une inscription existe
  const { data: checkins } = inscription
    ? await supabase
        .from('checkins')
        .select('*, ateliers(titre, lieu, sports(nom))')
        .eq('inscription_id', inscription.id)
        .order('horodatage', { ascending: true })
    : { data: [] };

  const nbCheckins = checkins?.length ?? 0;
  const totalStands = 13;
  const progression = Math.round((nbCheckins / totalStands) * 100);

  const paliers = [
    { nom: 'Bronze', seuil: 3, emoji: '🥉', debloque: nbCheckins >= 3 },
    { nom: 'Argent', seuil: 6, emoji: '🥈', debloque: nbCheckins >= 6 },
    { nom: 'Or', seuil: 10, emoji: '🥇', debloque: nbCheckins >= 10 },
    { nom: 'Platine', seuil: 13, emoji: '🏆', debloque: nbCheckins >= 13 },
  ];

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold">Mon passeport sportif</h1>
        <p className="mt-1 text-muted-foreground">
          Votre progression est synchronisée sur tous vos appareils.
        </p>
      </header>

      {/* Progression */}
      <section aria-labelledby="progress-heading" className="mb-8">
        <h2 id="progress-heading" className="sr-only">Progression</h2>
        <div className="rounded-xl border border-border p-6">
          <div className="flex justify-between mb-3">
            <span className="font-semibold">{nbCheckins} / {totalStands} stands</span>
            <span className="text-muted-foreground">{progression}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={nbCheckins}
            aria-valuemin={0}
            aria-valuemax={totalStands}
            aria-label={`Progression : ${nbCheckins} stands sur ${totalStands}`}
            className="h-4 rounded-full bg-muted overflow-hidden"
          >
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${progression}%` }}
            />
          </div>
        </div>
      </section>

      {/* Paliers */}
      <section aria-labelledby="paliers-heading" className="mb-8">
        <h2 id="paliers-heading" className="text-lg font-semibold mb-4">Badges débloqués</h2>
        <ol className="grid grid-cols-2 gap-4">
          {paliers.map((palier) => (
            <li
              key={palier.nom}
              className={`rounded-xl border p-4 text-center transition-all ${
                palier.debloque
                  ? 'border-brand bg-brand/5 shadow-sm'
                  : 'border-border opacity-50 grayscale'
              }`}
            >
              <p className="text-4xl mb-2" aria-hidden>{palier.emoji}</p>
              <p className="font-semibold text-sm">{palier.nom}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{palier.seuil} stands</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Historique des check-ins */}
      {checkins && checkins.length > 0 && (
        <section aria-labelledby="checkins-heading">
          <h2 id="checkins-heading" className="text-lg font-semibold mb-4">Stands visités</h2>
          <ul className="space-y-2">
            {checkins.map((ci: {
              id: string;
              horodatage: string;
              ateliers: { titre: string; lieu: string; sports?: { nom: string } | null } | null;
            }) => (
              <li key={ci.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 text-sm">
                <span className="text-green-500" aria-hidden>✓</span>
                <div className="flex-1">
                  <p className="font-medium">{ci.ateliers?.titre ?? 'Atelier'}</p>
                  <p className="text-xs text-muted-foreground">
                    {ci.ateliers?.lieu} · {new Date(ci.horodatage).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
