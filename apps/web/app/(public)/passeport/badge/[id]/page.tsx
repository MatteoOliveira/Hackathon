import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// P11 — Badge partageable

interface Props {
  params: Promise<{ id: string }>;
}

const BADGES: Record<string, { nom: string; emoji: string; seuil: number }> = {
  bronze: { nom: 'Bronze', emoji: '🥉', seuil: 3 },
  argent: { nom: 'Argent', emoji: '🥈', seuil: 6 },
  or: { nom: 'Or', emoji: '🥇', seuil: 10 },
  platine: { nom: 'Platine', emoji: '🏆', seuil: 13 },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const badge = BADGES[id.toLowerCase()];
  if (!badge) return { title: 'Badge introuvable' };

  return {
    title: `Badge ${badge.nom} — Solimouv' 2026`,
    description: `J'ai visité ${badge.seuil} stands au festival Solimouv' 2026 et obtenu le badge ${badge.nom} !`,
    openGraph: {
      title: `Badge ${badge.nom} — Solimouv' 2026`,
      description: `J'ai visité ${badge.seuil} stands et obtenu le badge ${badge.nom} !`,
      images: [`/og/badges/${id}.png`],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function BadgePage({ params }: Props) {
  const { id } = await params;
  const badge = BADGES[id.toLowerCase()];
  if (!badge) notFound();

  return (
    <main id="main-content" className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="container mx-auto max-w-sm px-4 sm:px-6 text-center">
        <div className="rounded-2xl border border-border p-10 shadow-lg">
          <p className="text-8xl mb-4" aria-hidden>{badge.emoji}</p>
          <h1 className="text-3xl font-extrabold">Badge {badge.nom}</h1>
          <p className="mt-2 text-muted-foreground">
            {badge.seuil} stands visités au festival Solimouv&apos; 2026 !
          </p>

          {/* Partage */}
          <div className="mt-8 flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">Partager ce badge</p>
            {/* TODO : boutons partage Twitter/X, Facebook, copier le lien */}
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-[#1DA1F2] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Twitter / X
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-[#1877F2] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Facebook
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors"
              >
                Copier le lien
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
