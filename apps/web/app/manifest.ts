import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Solimouv' — Festival du sport inclusif",
    short_name: "Solimouv'",
    description: "Le festival du sport pour toutes et tous, organisé par Up Sport!",
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#4F46E5',
    lang: 'fr',
    orientation: 'portrait',
    categories: ['sports', 'lifestyle', 'social'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        // @ts-expect-error — purpose est valide dans le standard
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/home-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        // @ts-expect-error
        form_factor: 'narrow',
        label: "Page d'accueil Solimouv'",
      },
    ],
  };
}
