import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client mock pour le développement sans Supabase configuré
// Retourne des données vides sur toutes les requêtes
function createMockClient() {
  const emptyResult = Promise.resolve({ data: null, error: null, count: 0 });

  // Chaîne de query builder — chaque méthode renvoie this pour permettre le chaînage
  function makeQueryBuilder(): Record<string, unknown> {
    const builder: Record<string, unknown> = {};
    const methods = ['select', 'insert', 'update', 'delete', 'upsert', 'eq', 'neq',
                     'in', 'not', 'is', 'gt', 'lt', 'gte', 'lte', 'like', 'ilike',
                     'order', 'limit', 'range', 'single', 'maybeSingle', 'throwOnError',
                     'returns', 'csv', 'head'];
    methods.forEach((m) => { builder[m] = () => builder; });
    // Rendre le builder "thenable" pour await
    builder.then = (resolve: (v: unknown) => unknown) =>
      emptyResult.then(resolve);
    builder.catch = () => builder;
    return builder;
  }

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: null }),
      signUp: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ error: null }),
    },
    from: (_table: string) => makeQueryBuilder(),
    storage: { from: () => ({}) },
  };
}

// Client Supabase pour les Server Components, Server Actions et Route Handlers
// Lit les cookies HTTP-only pour maintenir la session
export async function createClient() {
  if (!isSupabaseConfigured) {
    return createMockClient() as ReturnType<typeof createServerClient<Database>>;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // En Server Component, set() lance une erreur — ignoré intentionnellement
            // Les cookies sont mis à jour via le middleware
          }
        },
      },
    }
  );
}
