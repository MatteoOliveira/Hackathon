import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Fallback JS si le module WASM n'est pas disponible
// Même algorithme que crates/matching/src/lib.rs

const UserProfileSchema = z.object({
  tranche_age: z.string(),
  centres_interet: z.array(z.string()),
  besoins_accessibilite: z.array(z.string()),
  preference_intensite: z.number().int().min(1).max(5),
  preference_groupe: z.boolean(),
});

const SportSchema = z.object({
  id: z.string(),
  nom: z.string(),
  tags: z.array(z.string()),
  intensite: z.number().int().min(1).max(5),
  type_activite: z.array(z.string()),
  accessibilite_handicap: z.boolean(),
});

const RequestSchema = z.object({
  profile: UserProfileSchema,
  sports: z.array(SportSchema),
  top_n: z.number().int().min(1).max(13).default(3),
});

type Sport = z.infer<typeof SportSchema>;
type UserProfile = z.infer<typeof UserProfileSchema>;

interface Recommendation {
  sport_id: string;
  score: number;
  raisons: string[];
}

function scoreSport(profile: UserProfile, sport: Sport): Recommendation {
  let score = 0;
  const raisons: string[] = [];

  // Intérêts communs (poids fort : × 3)
  const commonInterests = profile.centres_interet.filter((t) => sport.tags.includes(t));
  if (commonInterests.length > 0) {
    score += commonInterests.length * 3;
    raisons.push(`${commonInterests.length} centre${commonInterests.length > 1 ? 's' : ''} d'intérêt commun${commonInterests.length > 1 ? 's' : ''}`);
  }

  // Proximité d'intensité
  const intensiteDiff = Math.abs(profile.preference_intensite - sport.intensite);
  score += Math.max(0, 5 - intensiteDiff);

  // Accessibilité
  if (profile.besoins_accessibilite.length > 0 && sport.accessibilite_handicap) {
    score += 5;
    raisons.push("Adapté à tes besoins d'accessibilité");
  }

  // Collectif / individuel
  const wantsGroup = profile.preference_groupe;
  const isGroup = sport.type_activite.includes('collectif');
  if (wantsGroup === isGroup) {
    score += 2;
  }

  return { sport_id: sport.id, score, raisons };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, sports, top_n } = RequestSchema.parse(body);

    const scored: Recommendation[] = sports
      .map((sport) => scoreSport(profile, sport))
      .sort((a, b) => b.score - a.score)
      .slice(0, top_n);

    return NextResponse.json({ recommendations: scored });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides.', details: err.errors }, { status: 400 });
    }
    console.error('[POST /api/matching]', err);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
