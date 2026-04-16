import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://solimouv.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Pages statiques publiques
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/a-propos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/programme`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/associations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/sports`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/inscription`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/passeport`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/mentions-legales`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/politique-confidentialite`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/accessibilite`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Routes dynamiques : associations
  const { data: associations } = await supabase
    .from('associations')
    .select('slug, updated_at')
    .eq('actif', true);

  const associationRoutes: MetadataRoute.Sitemap = (associations ?? []).map((a) => ({
    url: `${siteUrl}/associations/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Routes dynamiques : sports
  const { data: sports } = await supabase
    .from('sports')
    .select('slug, created_at');

  const sportRoutes: MetadataRoute.Sitemap = (sports ?? []).map((s) => ({
    url: `${siteUrl}/sports/${s.slug}`,
    lastModified: new Date(s.created_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...associationRoutes, ...sportRoutes];
}
