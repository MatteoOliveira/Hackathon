import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Middleware Next.js : rafraîchit la session Supabase sur chaque requête
// et protège les routes /compte/* et /admin/*
export async function middleware(request: NextRequest) {
  // Sans Supabase configuré (dev local sans .env), on laisse passer toutes les requêtes
  if (!supabaseConfigured) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT : ne pas écrire de logique entre createServerClient et getUser()
  // Voir : https://supabase.com/docs/guides/auth/server-side/nextjs
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protéger /compte/* — redirige si non connecté
  if (pathname.startsWith('/compte') && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/connexion';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Protéger /admin/* — redirige si non connecté
  // La vérification du rôle est faite dans app/admin/layout.tsx (plus sûre côté serveur)
  if (pathname.startsWith('/admin') && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/connexion';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Rediriger les utilisateurs connectés hors des pages auth
  if (user && (pathname === '/connexion' || pathname === '/inscription-compte')) {
    const url = request.nextUrl.clone();
    url.pathname = '/compte';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Exclure les ressources statiques, les API et le service worker
    '/((?!_next/static|_next/image|favicon.ico|icons|og|wasm|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
