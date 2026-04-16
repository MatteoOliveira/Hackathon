import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const ContactSchema = z.object({
  nom: z.string().min(1).max(100),
  email: z.string().email(),
  sujet: z.string().max(100).optional(),
  message: z.string().min(10).max(2000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = ContactSchema.parse(body);

    const supabase = await createClient();

    const { error } = await supabase.from('messages_contact').insert(data);
    if (error) throw error;

    // Ping Make webhook si configuré
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (makeWebhookUrl) {
      await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', ...data }),
      }).catch((err) => {
        // Ne pas bloquer la réponse si Make échoue
        console.warn('[/api/contact] Make webhook failed:', err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides.', details: err.errors }, { status: 400 });
    }
    console.error('[POST /api/contact]', err);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
