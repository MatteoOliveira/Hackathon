import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

// P24 — Messages de contact
export const metadata: Metadata = {
  title: 'Messages — Admin',
  robots: { index: false },
};

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from('messages_contact')
    .select('*')
    .order('created_at', { ascending: false });

  const nbNonTraites = messages?.filter((m) => !m.traite).length ?? 0;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold">Messages de contact</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {nbNonTraites} message{nbNonTraites !== 1 ? 's' : ''} non traité{nbNonTraites !== 1 ? 's' : ''}
        </p>
      </header>

      {!messages || messages.length === 0 ? (
        <div className="rounded-xl border border-border p-10 text-center text-muted-foreground">
          Aucun message pour l&apos;instant.
        </div>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className={`rounded-xl border p-6 ${msg.traite ? 'border-border opacity-60' : 'border-brand/30 bg-brand/5'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">
                    {msg.nom}
                    {msg.sujet && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-normal">
                        {msg.sujet}
                      </span>
                    )}
                  </p>
                  <a href={`mailto:${msg.email}`} className="text-sm text-brand hover:underline">{msg.email}</a>
                </div>
                <time className="text-xs text-muted-foreground flex-shrink-0">
                  {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                </time>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
              {!msg.traite && (
                <div className="mt-4">
                  {/* TODO : Server Action marquer comme traité */}
                  <button type="button" className="text-xs px-3 py-1.5 rounded-lg bg-brand text-white font-medium hover:bg-brand-dark transition-colors">
                    Marquer comme traité
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
