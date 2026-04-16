import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const CheckinSchema = z.object({
  inscription_id: z.string().uuid(),
  code_saisi: z.string().min(1).max(20).toUpperCase(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inscription_id, code_saisi } = CheckinSchema.parse(body);

    const supabase = await createClient();

    // Trouver l'atelier correspondant au code
    const { data: atelier, error: atelierError } = await supabase
      .from('ateliers')
      .select('id, titre, code_stand')
      .eq('code_stand', code_saisi)
      .eq('actif', true)
      .single();

    if (atelierError || !atelier) {
      return NextResponse.json({ error: 'Code invalide ou stand inactif.' }, { status: 404 });
    }

    // Vérifier que l'inscription existe
    const { data: inscription } = await supabase
      .from('inscriptions')
      .select('id')
      .eq('id', inscription_id)
      .single();

    if (!inscription) {
      return NextResponse.json({ error: 'Inscription introuvable.' }, { status: 404 });
    }

    // Enregistrer le check-in (contrainte UNIQUE empêche les doublons)
    const { data: checkin, error: checkinError } = await supabase
      .from('checkins')
      .insert({
        inscription_id,
        atelier_id: atelier.id,
        code_saisi,
      })
      .select('*, ateliers(titre)')
      .single();

    if (checkinError) {
      if (checkinError.code === '23505') {
        return NextResponse.json({ error: 'Vous avez déjà visité ce stand.' }, { status: 409 });
      }
      throw checkinError;
    }

    // Compter le total de check-ins pour calculer le palier débloqué
    const { count: totalCheckins } = await supabase
      .from('checkins')
      .select('*', { count: 'exact', head: true })
      .eq('inscription_id', inscription_id);

    const paliers: Record<number, string> = { 3: 'bronze', 6: 'argent', 10: 'or', 13: 'platine' };
    const palierDebloque = paliers[totalCheckins ?? 0] ?? null;

    // Si palier débloqué, le noter dans le check-in
    if (palierDebloque) {
      await supabase
        .from('checkins')
        .update({ palier_debloque: palierDebloque })
        .eq('id', checkin.id);
    }

    return NextResponse.json({
      success: true,
      atelier: { id: atelier.id, titre: atelier.titre },
      totalCheckins,
      palierDebloque,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides.', details: err.errors }, { status: 400 });
    }
    console.error('[POST /api/checkin]', err);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
