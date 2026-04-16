import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Route API admin protégée — agrégats pour le dashboard
export async function GET() {
  const supabase = await createClient();

  // Vérification du rôle admin côté serveur
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  // Agrégats
  const [
    { count: nbInscriptions },
    { count: nbCheckins },
    { data: palierStats },
    { data: checkinsByHour },
  ] = await Promise.all([
    supabase.from('inscriptions').select('*', { count: 'exact', head: true }),
    supabase.from('checkins').select('*', { count: 'exact', head: true }),
    // Répartition des paliers débloqués
    supabase
      .from('checkins')
      .select('palier_debloque')
      .not('palier_debloque', 'is', null),
    // Check-ins par heure (pour le graphique)
    supabase
      .from('checkins')
      .select('horodatage')
      .order('horodatage', { ascending: true }),
  ]);

  // Calcul répartition paliers
  const paliersCount: Record<string, number> = { bronze: 0, argent: 0, or: 0, platine: 0 };
  for (const row of palierStats ?? []) {
    if (row.palier_debloque && row.palier_debloque in paliersCount) {
      paliersCount[row.palier_debloque]++;
    }
  }

  // Regrouper les check-ins par heure (0-23)
  const hourMap: Record<number, number> = {};
  for (const row of checkinsByHour ?? []) {
    const hour = new Date(row.horodatage).getHours();
    hourMap[hour] = (hourMap[hour] ?? 0) + 1;
  }
  const checkinsByHourArray = Array.from({ length: 24 }, (_, h) => ({
    heure: h,
    count: hourMap[h] ?? 0,
  }));

  return NextResponse.json({
    nbInscriptions,
    nbCheckins,
    paliers: paliersCount,
    checkinsByHour: checkinsByHourArray,
  });
}
