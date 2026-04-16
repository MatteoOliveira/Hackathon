# 🏗️ Architecture technique — Solimouv' PWA

> Document de référence pour l'équipe technique. Lire le [README](../README.md) d'abord pour le contexte produit.

---

## 📋 Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Objectifs techniques](#2-objectifs-techniques)
3. [Diagramme d'architecture](#3-diagramme-darchitecture)
4. [Stack détaillée](#4-stack-détaillée)
5. [Modèle de données](#5-modèle-de-données)
6. [Sécurité & RLS](#6-sécurité--rls)
7. [Authentification](#7-authentification)
8. [Cartographie des pages](#8-cartographie-des-pages)
9. [Intégration Rust / WebAssembly](#9-intégration-rust--webassembly)
10. [PWA & offline](#10-pwa--offline)
11. [SEO & performance](#11-seo--performance)
12. [Accessibilité](#12-accessibilité)
13. [Variables d'environnement](#13-variables-denvironnement)
14. [Déploiement](#14-déploiement)
15. [Versions & roadmap](#15-versions--roadmap)
16. [Décisions techniques (ADR légers)](#16-décisions-techniques-adr-légers)

---

## 1. Vue d'ensemble

Solimouv' PWA est une application web **monolithique hébergée sur Vercel**, adossée à **Supabase** pour la persistance des données et l'authentification. Un **module Rust** compilé en WebAssembly est intégré côté client pour l'algorithme de matching sport ↔ profil.

**Principe directeur** : minimiser le nombre de services externes pour tenir la fenêtre de 24h et assurer la maintenabilité par une équipe tech réduite.

---

## 2. Objectifs techniques

| Objectif | Cible |
|---|---|
| Lighthouse Performance | > 90 (obligatoire > 70) |
| Lighthouse Accessibility | > 95 |
| Lighthouse SEO | 100 |
| Lighthouse PWA | Installable, toutes cases vertes |
| Time to Interactive | < 2s sur 4G |
| Bundle initial JS | < 180 kB gzip |
| Compatibilité | iOS Safari 15+, Chrome/Edge/Firefox 2 dernières versions |
| Pérennité | Édition N+1 sans refactor (contenu éditable) |

---

## 3. Diagramme d'architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         CLIENT (Navigateur)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │             PWA Next.js 15 (installée)                   │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────────┐   │  │
│  │  │ Pages   │  │ Compte  │  │  Admin  │  │  Module    │   │  │
│  │  │ publiques│  │  user   │  │         │  │   WASM     │   │  │
│  │  └─────────┘  └─────────┘  └─────────┘  │  (Rust)    │   │  │
│  │                                          └────────────┘   │  │
│  │   Service Worker (cache offline, notifications)          │  │
│  └──────────────────────┬───────────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────────────┘
                          │ HTTPS
                          ▼
┌────────────────────────────────────────────────────────────────┐
│                         VERCEL (Edge Network)                  │
│   - Static assets (HTML, CSS, JS, WASM, images)                │
│   - SSR / SSG / ISR                                            │
│   - API routes Next.js (/api/*)                                │
└─────────────────────────┬──────────────────────────────────────┘
                          │
            ┌─────────────┴──────────────┐
            ▼                             ▼
┌──────────────────────┐      ┌─────────────────────────┐
│      SUPABASE        │      │         MAKE            │
│  ┌────────────────┐  │      │  - Webhooks             │
│  │  PostgreSQL    │  │      │  - Notifications email  │
│  │  + RLS         │  │      │  - Sync Google Sheets   │
│  └────────────────┘  │      │                         │
│  ┌────────────────┐  │      │  (opéré par la team     │
│  │  Auth (JWT)    │  │      │   automatisation)       │
│  └────────────────┘  │      └─────────────────────────┘
│  ┌────────────────┐  │
│  │  Storage       │  │
│  │  (logos assos, │  │
│  │   badges, ...) │  │
│  └────────────────┘  │
└──────────────────────┘
```

---

## 4. Stack détaillée

### 4.1 Frontend

- **Next.js 15** avec App Router
  - Server Components par défaut (meilleur SEO, moins de JS envoyé)
  - Client Components uniquement pour l'interactivité (formulaires, countdown, scanner de code)
- **React 19**
- **TypeScript** en mode strict
- **Tailwind CSS** pour le styling utilitaire
- **shadcn/ui** — composants Radix UI pré-stylés (Button, Dialog, Form, Table, Toast…)
- **lucide-react** pour les icônes
- **react-hook-form** + **zod** pour les formulaires
- **date-fns** pour le countdown et la gestion des dates FR

### 4.2 PWA

- **@serwist/next** — successeur maintenu de next-pwa
  - Service worker généré automatiquement
  - Stratégies de cache configurables
- **manifest.ts** — généré par Next.js à `/manifest.webmanifest`
- **Icônes** — jeu complet 192/512 + maskable + Apple Touch

### 4.3 Backend léger

- **Next.js API Routes** (`app/api/*`) pour les opérations serveur
- **Supabase** comme BaaS :
  - PostgreSQL 15
  - Auth basé sur JWT
  - Row Level Security activé partout
  - Storage pour les fichiers (logos, badges PDF)

### 4.4 Rust / WebAssembly

- **Crate `matching`** (`crates/matching/`)
  - `wasm-bindgen` pour les bindings JS
  - `serde` + `serde-wasm-bindgen` pour la sérialisation
  - Compilé avec `wasm-pack build --target web`
- **Sortie** : `apps/web/public/wasm/matching_bg.wasm` + bindings JS
- **Appel côté Next.js** via un dynamic import dans un Client Component

### 4.5 Outils de développement

- **pnpm** workspaces (monorepo)
- **ESLint** + **Prettier**
- **Husky** + **lint-staged** (optionnel si temps)
- **GitHub Actions** — CI : lint + typecheck + build

---

## 5. Modèle de données

### 5.1 Schéma SQL

```sql
-- ============================================================
-- 0001_init.sql — Schéma initial Solimouv
-- ============================================================

-- Profils utilisateurs (lié à auth.users de Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  prenom TEXT NOT NULL,
  nom TEXT,
  tranche_age TEXT CHECK (tranche_age IN ('<18', '18-25', '26-40', '41-60', '60+')),
  centres_interet TEXT[] DEFAULT '{}',
  besoins_accessibilite TEXT[] DEFAULT '{}',
  langue TEXT DEFAULT 'fr',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  consent_notifs BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Associations partenaires
CREATE TABLE associations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  site_web TEXT,
  contact_email TEXT,
  couleur_theme TEXT DEFAULT '#4F46E5',
  ordre_affichage INT DEFAULT 0,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sports proposés
CREATE TABLE sports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  niveau_requis TEXT DEFAULT 'débutant' CHECK (niveau_requis IN ('débutant', 'intermédiaire', 'confirmé', 'tous_niveaux')),
  materiel_requis TEXT[],
  accessibilite_handicap BOOLEAN DEFAULT false,
  accessibilite_debutant BOOLEAN DEFAULT true,
  intensite INT CHECK (intensite BETWEEN 1 AND 5),
  type_activite TEXT[] DEFAULT '{}',       -- ['collectif', 'individuel', 'interieur', 'exterieur']
  tags TEXT[] DEFAULT '{}',                -- pour le matching
  icon TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table de liaison sports ↔ associations
CREATE TABLE sport_associations (
  sport_id UUID REFERENCES sports(id) ON DELETE CASCADE,
  association_id UUID REFERENCES associations(id) ON DELETE CASCADE,
  PRIMARY KEY (sport_id, association_id)
);

-- Ateliers / sessions du festival
CREATE TABLE ateliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id UUID REFERENCES sports(id) ON DELETE SET NULL,
  association_id UUID REFERENCES associations(id) ON DELETE SET NULL,
  titre TEXT NOT NULL,
  description TEXT,
  horaire_debut TIMESTAMPTZ NOT NULL,
  horaire_fin TIMESTAMPTZ NOT NULL,
  lieu TEXT NOT NULL,
  capacite_max INT DEFAULT 30,
  public_cible TEXT[] DEFAULT '{}',        -- ['familles', 'jeunes', 'seniors', ...]
  code_stand TEXT UNIQUE NOT NULL,         -- code à saisir dans le passeport
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inscriptions au festival (pour les utilisateurs authentifiés OU anonymes)
CREATE TABLE inscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- null si anonyme
  email TEXT,                              -- requis si anonyme
  prenom TEXT NOT NULL,
  tranche_age TEXT,
  centres_interet TEXT[] DEFAULT '{}',
  besoins_accessibilite TEXT[] DEFAULT '{}',
  sports_recommandes UUID[] DEFAULT '{}',  -- résultat du matching
  consent_notifs BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT inscriptions_user_or_email CHECK (user_id IS NOT NULL OR email IS NOT NULL)
);

-- Check-ins du passeport (brique complémentaire)
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inscription_id UUID REFERENCES inscriptions(id) ON DELETE CASCADE,
  atelier_id UUID REFERENCES ateliers(id) ON DELETE CASCADE,
  code_saisi TEXT NOT NULL,
  palier_debloque TEXT,                    -- 'bronze' | 'argent' | 'or' | 'platine'
  horodatage TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (inscription_id, atelier_id)      -- un seul check-in par atelier
);

-- Messages du formulaire de contact
CREATE TABLE messages_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  sujet TEXT,
  message TEXT NOT NULL,
  traite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuration globale (éditable par admin, lue partout)
CREATE TABLE config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Valeurs initiales de config
INSERT INTO config (key, value) VALUES
  ('edition', '{"numero": 2, "annee": 2026}'),
  ('date_festival', '"2026-07-11T10:00:00Z"'),
  ('lieu_festival', '"Centre Sportif Charles Moureu, Paris"'),
  ('festival_actif', 'false'),
  ('paliers_passeport', '{"bronze": 3, "argent": 6, "or": 10, "platine": 13}');

-- Index pour les requêtes fréquentes
CREATE INDEX idx_ateliers_horaire ON ateliers(horaire_debut);
CREATE INDEX idx_ateliers_code ON ateliers(code_stand);
CREATE INDEX idx_inscriptions_user ON inscriptions(user_id);
CREATE INDEX idx_checkins_inscription ON checkins(inscription_id);

-- Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER associations_updated_at BEFORE UPDATE ON associations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER config_updated_at BEFORE UPDATE ON config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour créer un profil automatiquement à l'inscription Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, prenom)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'prenom', 'Participant'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 5.2 Relations principales

```
auth.users (Supabase)
    │ 1:1
    ▼
profiles
    │ 1:N
    ▼
inscriptions ───N:1──→ ateliers ───N:1──→ sports ──N:M──→ associations
    │ 1:N                  │
    ▼                      │
checkins  ─────────────────┘
```

---

## 6. Sécurité & RLS

**RLS activée sur TOUTES les tables** (règle absolue Supabase). Voici les policies par table :

### 6.1 Tables publiques en lecture

```sql
-- associations, sports, ateliers, config : lecture publique
ALTER TABLE associations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "associations_public_read" ON associations
  FOR SELECT USING (actif = true);

ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sports_public_read" ON sports FOR SELECT USING (true);

ALTER TABLE ateliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ateliers_public_read" ON ateliers
  FOR SELECT USING (actif = true);

ALTER TABLE config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "config_public_read" ON config FOR SELECT USING (true);
```

### 6.2 Profils utilisateurs

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Chacun voit et modifie son propre profil
CREATE POLICY "profiles_self_read" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_self_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins voient tous les profils
CREATE POLICY "profiles_admin_read" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
```

### 6.3 Inscriptions

```sql
ALTER TABLE inscriptions ENABLE ROW LEVEL SECURITY;

-- Insertion publique (anonyme OK)
CREATE POLICY "inscriptions_public_insert" ON inscriptions
  FOR INSERT WITH CHECK (true);

-- Lecture : soi-même ou admin
CREATE POLICY "inscriptions_self_read" ON inscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "inscriptions_admin_read" ON inscriptions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
```

### 6.4 Checkins

```sql
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "checkins_insert" ON checkins
  FOR INSERT WITH CHECK (true);

CREATE POLICY "checkins_self_read" ON checkins
  FOR SELECT USING (
    inscription_id IN (SELECT id FROM inscriptions WHERE user_id = auth.uid())
  );
CREATE POLICY "checkins_admin_read" ON checkins
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
```

### 6.5 Écriture admin uniquement

```sql
-- Pour associations, sports, ateliers, config :
-- seuls les admins peuvent insert/update/delete
CREATE POLICY "associations_admin_write" ON associations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
-- (à dupliquer pour sports, ateliers, config, messages_contact)
```

---

## 7. Authentification

### 7.1 Flux utilisateur

```
  [Visiteur anonyme]
        │
        ├── Peut consulter pages publiques ✓
        ├── Peut s'inscrire au festival sans compte (email seul) ✓
        ├── Peut utiliser le passeport en localStorage ✓
        │
        └── Crée un compte (email + mdp OU magic link)
                │
                ▼
        [Utilisateur connecté]
                │
                ├── Accède à /compte (son espace perso)
                ├── Passeport persistant cross-device
                ├── Notifications personnalisées
                └── Historique d'éditions (pérennité)
```

### 7.2 Flux admin

Les admins sont des `profiles` avec `role = 'admin'` ou `'super_admin'`.

**Promotion manuelle** (via SQL Editor Supabase) :
```sql
UPDATE profiles SET role = 'admin' WHERE id = '<uuid>';
```

**Middleware Next.js** (`app/admin/layout.tsx`) :
1. Vérifie la session Supabase côté serveur
2. Charge le profil et vérifie `role IN ('admin', 'super_admin')`
3. Redirige vers `/connexion?redirect=/admin` sinon

### 7.3 Routes protégées

| Route | Accès |
|---|---|
| `/` et `/(public)/*` | Tout le monde |
| `/connexion`, `/inscription-compte` | Anonymes uniquement (redirige si connecté) |
| `/compte/*` | Utilisateurs connectés |
| `/admin/*` | Admins uniquement |
| `/api/admin/*` | Token admin vérifié |

### 7.4 Espace utilisateur (`/compte`)

**Contenu à définir avec l'équipe**, proposition initiale :

- `/compte` — Tableau de bord perso
- `/compte/profil` — Éditer ses infos
- `/compte/passeport` — Progression + badges débloqués
- `/compte/recommandations` — Sports matchés pour lui
- `/compte/notifications` — Préférences de notifs

⚠️ **À valider avec le groupe** : contenu exact de la page user.

---

## 8. Cartographie des pages

Vue exhaustive des pages de l'application, classées par zone d'accès. Chaque page a un ID stable (`P01`, `P02`…) utilisable dans les tickets et commits (`feat(P09): formulaire matching`).

### 8.1 Vue synthétique

| Zone | Nombre de pages | Auth requise |
|---|---|---|
| Publiques (socle minimal) | 8 | ❌ |
| Briques complémentaires | 3 | ❌ (mais peut être enrichi si connecté) |
| Espace utilisateur | 7 | ✅ (user) |
| Espace admin | 7 | ✅ (admin / super_admin) |
| Utilitaires & légal | 6 | ❌ |
| **Total** | **31 pages** | |

### 8.2 Pages publiques — Socle minimal

> Requises par SM-1. Sans ces pages, le socle n'est pas validé.

| ID | Route | Titre | Contenu principal |
|---|---|---|---|
| P01 | `/` | Accueil | Hero visuel, compte à rebours J-X, chiffres clés édition 1, CTA inscription, teaser assos |
| P02 | `/a-propos` | À propos | Up Sport! (mission, 4 programmes, 250 pers/semaine) + Solimouv' (histoire, valeurs) |
| P03 | `/programme` | Programme / Ateliers | Planning par créneau horaire, filtres (sport, public, accessibilité), lieux |
| P04 | `/associations` | Associations partenaires | Grille des 13 assos (logo + pitch court) |
| P05 | `/associations/[slug]` | Fiche association | Description complète, sports proposés, contact, site web |
| P06 | `/sports` | Sports | Catalogue des sports proposés au festival |
| P07 | `/sports/[slug]` | Fiche sport | Détail d'un sport : règles, matériel, niveau, accessibilité, assos qui le proposent |
| P08 | `/contact` | Contact | Formulaire + infos Up Sport! + réseaux sociaux |

### 8.3 Pages des briques complémentaires

> Non requises par le socle, mais attendues pour la notation bonus.

| ID | Route | Titre | Contenu |
|---|---|---|---|
| P09 | `/inscription` | Inscription festival + Matching | Formulaire profil (âge, intérêts, accessibilité) → appel WASM Rust → top 3 sports recommandés |
| P10 | `/passeport` | Mon passeport sportif | Saisie de code stand, progression X/13, paliers Bronze/Argent/Or/Platine, badge débloqué |
| P11 | `/passeport/badge/[id]` | Badge partageable | Image Open Graph générée dynamiquement, boutons partage réseaux sociaux |

### 8.4 Espace utilisateur (auth requise)

> Accessibles uniquement avec un compte. Les anonymes sont redirigés vers `/connexion`.

| ID | Route | Titre | Contenu |
|---|---|---|---|
| P12 | `/connexion` | Connexion | Email + mot de passe + lien reset |
| P13 | `/inscription-compte` | Création de compte | Email + mot de passe + prénom |
| P14 | `/mot-de-passe-oublie` | Réinitialisation | Formulaire email → envoi lien magique |
| P15 | `/compte` | Tableau de bord | Vue d'ensemble : recommandations, passeport, notifs *(contenu à valider)* |
| P16 | `/compte/profil` | Mon profil | Édition infos personnelles, intérêts, accessibilité, préférences notifs |
| P17 | `/compte/passeport` | Mon passeport (persistant) | Version synchronisée cross-device du passeport |
| P18 | `/compte/recommandations` | Mes sports recommandés | Résultats de matching + assos correspondantes |

> ⚠️ Le **contenu de `/compte`** reste **à valider avec l'équipe**. Les pages P15–P18 sont la proposition initiale du Tech Lead.

### 8.5 Espace admin (rôle admin ou super_admin requis)

> Protégé par middleware Next.js qui vérifie `profiles.role IN ('admin', 'super_admin')`.

| ID | Route | Titre | Contenu |
|---|---|---|---|
| P19 | `/admin` | Dashboard orga | Stats temps réel : inscrits, check-ins par stand, paliers débloqués, graphique horaire |
| P20 | `/admin/associations` | CRUD associations | Liste + ajout / édition / suppression / réordonnancement |
| P21 | `/admin/sports` | CRUD sports | Gestion des fiches sports et tags matching |
| P22 | `/admin/ateliers` | CRUD ateliers | Programme du jour J, génération des codes stands |
| P23 | `/admin/inscriptions` | Liste inscriptions | Recherche, filtres, export CSV |
| P24 | `/admin/messages` | Messages de contact | Boîte de réception des formulaires de contact |
| P25 | `/admin/config` | Paramètres globaux | Date du festival, lieu, édition active, seuils des paliers passeport |

### 8.6 Pages utilitaires & légales

| ID | Route | Titre | Obligation |
|---|---|---|---|
| P26 | `/offline` | Hors-ligne | Affichée par le service worker si ressource non cachée et sans réseau |
| P27 | `/404` | Page non trouvée | Gestion erreur standard |
| P28 | `/500` | Erreur serveur | Gestion erreur standard |
| P29 | `/mentions-legales` | Mentions légales | Obligatoire (loi française LCEN) |
| P30 | `/politique-confidentialite` | Politique de confidentialité | Obligatoire (RGPD, car collecte d'emails) |
| P31 | `/accessibilite` | Déclaration d'accessibilité | Recommandé (obligatoire pour orga à subvention publique) |

### 8.7 Ressources auto-générées (hors pages visuelles)

| Route | Rôle | Généré par |
|---|---|---|
| `/manifest.webmanifest` | Manifest PWA | `app/manifest.ts` |
| `/sitemap.xml` | Sitemap SEO (inclut P01–P11, P29–P31) | `app/sitemap.ts` |
| `/robots.txt` | Bloque `/admin` et `/compte` du crawl | `app/robots.ts` |
| `/api/checkin` | Valide un code stand | API Route |
| `/api/matching` | Fallback JS si WASM indisponible | API Route |
| `/api/contact` | Enregistre un message + ping Make | API Route |
| `/api/admin/stats` | Agrégats live pour le dashboard | API Route protégée |

### 8.8 Priorisation sur 24h

Toutes les pages ne seront pas livrées. Voici l'arbitrage proposé :

**🔴 Must-have (14 pages) — livraison obligatoire**
P01, P02, P03, P04, P06, P08 (socle)
P09, P10 (briques)
P12, P15 (auth minimale)
P19 (admin)
P26, P27, P29 (utilitaires)

**🟡 Should-have (9 pages) — si temps restant**
P05, P07 (fiches détaillées)
P11 (badge partageable)
P13, P16, P17 (auth complète)
P20, P21, P22 (CRUD admin)

**🟢 Nice-to-have (8 pages) — roadmap post-hackathon**
P14, P18, P23, P24, P25, P28, P30, P31

### 8.9 Arborescence App Router correspondante

```
apps/web/app/
├── (public)/
│   ├── page.tsx                   # P01
│   ├── a-propos/page.tsx          # P02
│   ├── programme/page.tsx         # P03
│   ├── associations/
│   │   ├── page.tsx               # P04
│   │   └── [slug]/page.tsx        # P05
│   ├── sports/
│   │   ├── page.tsx               # P06
│   │   └── [slug]/page.tsx        # P07
│   ├── contact/page.tsx           # P08
│   ├── inscription/page.tsx       # P09
│   └── passeport/
│       ├── page.tsx               # P10
│       └── badge/[id]/page.tsx    # P11
├── (auth)/
│   ├── connexion/page.tsx         # P12
│   ├── inscription-compte/page.tsx # P13
│   └── mot-de-passe-oublie/page.tsx # P14
├── compte/
│   ├── layout.tsx                 # middleware auth
│   ├── page.tsx                   # P15
│   ├── profil/page.tsx            # P16
│   ├── passeport/page.tsx         # P17
│   └── recommandations/page.tsx   # P18
├── admin/
│   ├── layout.tsx                 # middleware auth + role
│   ├── page.tsx                   # P19
│   ├── associations/page.tsx      # P20
│   ├── sports/page.tsx            # P21
│   ├── ateliers/page.tsx          # P22
│   ├── inscriptions/page.tsx      # P23
│   ├── messages/page.tsx          # P24
│   └── config/page.tsx            # P25
├── offline/page.tsx               # P26
├── not-found.tsx                  # P27
├── error.tsx                      # P28
├── mentions-legales/page.tsx      # P29
├── politique-confidentialite/page.tsx # P30
├── accessibilite/page.tsx         # P31
└── api/
    ├── checkin/route.ts
    ├── matching/route.ts
    ├── contact/route.ts
    └── admin/stats/route.ts
```

---

## 9. Intégration Rust / WebAssembly

### 9.1 Pourquoi Rust ici

L'algorithme de matching profil ↔ sport est un **calcul pur** sur des tableaux de tags. Il est parfait pour WASM :
- Exécuté côté client → offline-friendly, réactif, pas de round-trip serveur
- Performance native → même avec 100 sports et 50 critères, < 10 ms
- Démonstration de maîtrise Rust pour le bonus référent

### 9.2 Structure de la crate

```
crates/matching/
├── Cargo.toml
├── src/
│   └── lib.rs            # Fonction scoring exposée à JS
└── README.md
```

### 9.3 Exemple d'API exposée

```rust
// crates/matching/src/lib.rs
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Deserialize)]
pub struct UserProfile {
    pub tranche_age: String,
    pub centres_interet: Vec<String>,
    pub besoins_accessibilite: Vec<String>,
    pub preference_intensite: u8,  // 1-5
    pub preference_groupe: bool,
}

#[derive(Deserialize)]
pub struct Sport {
    pub id: String,
    pub nom: String,
    pub tags: Vec<String>,
    pub intensite: u8,
    pub type_activite: Vec<String>,
    pub accessibilite_handicap: bool,
}

#[derive(Serialize)]
pub struct Recommendation {
    pub sport_id: String,
    pub score: f32,
    pub raisons: Vec<String>,
}

#[wasm_bindgen]
pub fn compute_matching(
    profile_js: JsValue,
    sports_js: JsValue,
    top_n: usize,
) -> Result<JsValue, JsValue> {
    let profile: UserProfile = serde_wasm_bindgen::from_value(profile_js)?;
    let sports: Vec<Sport> = serde_wasm_bindgen::from_value(sports_js)?;

    let mut scored: Vec<Recommendation> = sports
        .iter()
        .map(|sport| score_sport(&profile, sport))
        .collect();

    scored.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap());
    scored.truncate(top_n);

    Ok(serde_wasm_bindgen::to_value(&scored)?)
}

fn score_sport(profile: &UserProfile, sport: &Sport) -> Recommendation {
    let mut score = 0.0_f32;
    let mut raisons = Vec::new();

    // Intérêts communs
    let common_interests = profile.centres_interet.iter()
        .filter(|t| sport.tags.contains(t))
        .count();
    if common_interests > 0 {
        score += common_interests as f32 * 3.0;
        raisons.push(format!("{} centres d'intérêt communs", common_interests));
    }

    // Intensité
    let intensite_diff = (profile.preference_intensite as i32 - sport.intensite as i32).abs();
    score += (5 - intensite_diff).max(0) as f32;

    // Accessibilité
    if !profile.besoins_accessibilite.is_empty() && sport.accessibilite_handicap {
        score += 5.0;
        raisons.push("Adapté à tes besoins d'accessibilité".to_string());
    }

    // Préférence collectif/individuel
    let wants_group = profile.preference_groupe;
    let is_group = sport.type_activite.contains(&"collectif".to_string());
    if wants_group == is_group {
        score += 2.0;
    }

    Recommendation {
        sport_id: sport.id.clone(),
        score,
        raisons,
    }
}
```

### 9.4 Build & intégration

```bash
# Compilation
cd crates/matching
wasm-pack build --target web --out-dir ../../apps/web/public/wasm

# Résultat
apps/web/public/wasm/
├── matching.js              # bindings
├── matching_bg.wasm         # module compilé
└── matching.d.ts            # types TS
```

**Appel depuis Next.js** (composant client) :

```tsx
// apps/web/components/matching-form.tsx
'use client';
import { useState } from 'react';

export function MatchingForm({ sports }: { sports: Sport[] }) {
  const [results, setResults] = useState<Recommendation[]>([]);

  async function runMatching(profile: UserProfile) {
    // Import dynamique du module WASM
    const wasm = await import('/wasm/matching.js');
    await wasm.default();
    const recos = wasm.compute_matching(profile, sports, 3);
    setResults(recos);
  }

  return <>{/* ...formulaire + affichage résultats... */}</>;
}
```

---

## 10. PWA & offline

### 10.1 Manifest

`apps/web/app/manifest.ts` (généré par Next.js) :

```ts
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
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
```

### 10.2 Service Worker (Serwist)

Configuré dans `next.config.js` via `@serwist/next`. Stratégies :

| Ressource | Stratégie |
|---|---|
| HTML pages | `NetworkFirst` (fallback offline) |
| JS / CSS / WASM | `StaleWhileRevalidate` |
| Images | `CacheFirst` + expiration 30 jours |
| API `/api/*` | `NetworkOnly` (jamais en cache) |
| Polices Google | `CacheFirst` |

### 10.3 Page offline

`app/offline/page.tsx` — affiche un message + lien de retour dès qu'une ressource non-cachée est demandée hors-ligne.

---

## 11. SEO & performance

### 11.1 Metadata par page

Chaque page utilise la Metadata API de Next.js :

```ts
export const metadata: Metadata = {
  title: "Programme — Solimouv' 2026",
  description: "Découvrez le programme complet du festival Solimouv' 2026 : ateliers sportifs, stands associatifs, sensibilisation à l'inclusion.",
  openGraph: {
    title: "Programme — Solimouv' 2026",
    description: "...",
    images: ['/og/programme.png'],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};
```

### 11.2 Schema.org (données structurées)

JSON-LD injecté dans `<head>` via Next.js :

```json
{
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "Solimouv' 2026",
  "startDate": "2026-07-11T10:00:00+02:00",
  "endDate": "2026-07-11T18:00:00+02:00",
  "location": {
    "@type": "Place",
    "name": "Centre Sportif Charles Moureu",
    "address": "Paris"
  },
  "organizer": {
    "@type": "Organization",
    "name": "Up Sport!",
    "url": "https://www.unispourlesport.paris/"
  },
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
  "isAccessibleForFree": true
}
```

### 11.3 Sitemap & robots

- `app/sitemap.ts` — généré dynamiquement depuis Supabase (assos, sports)
- `app/robots.ts` — autorise tout, bloque `/admin` et `/compte`

### 11.4 Optimisations performance

- Images via `next/image` avec `priority` sur LCP
- Fonts via `next/font` (auto-hosting, zéro layout shift)
- Lazy loading des modules WASM (dynamic import)
- Code splitting par route (App Router le fait nativement)

---

## 12. Accessibilité

Objectif : **WCAG 2.1 niveau AA minimum**, viser AAA sur les CTAs.

### 12.1 Checklist intégrée

- [ ] Contraste texte normal ≥ 4.5:1, large ≥ 3:1
- [ ] Focus visible sur tous les éléments interactifs (`:focus-visible`)
- [ ] Navigation 100% clavier (Tab, Enter, Escape)
- [ ] Attributs ARIA corrects (`aria-label`, `aria-live`, `role`)
- [ ] Texte alternatif pour toutes les images non décoratives
- [ ] Structure sémantique (un seul `<h1>`, hiérarchie respectée)
- [ ] `lang="fr"` sur `<html>`
- [ ] Respect de `prefers-reduced-motion` pour animations
- [ ] Respect de `prefers-color-scheme` (mode sombre)
- [ ] Taille de police minimum 16px, ajustable
- [ ] Zone de clic minimum 44×44px (mobile)
- [ ] Formulaires avec labels explicites et messages d'erreur clairs
- [ ] Skip link "Aller au contenu principal"

### 12.2 Tests

- Axe DevTools (extension navigateur)
- Lighthouse Accessibility
- Navigation clavier manuelle
- VoiceOver (macOS/iOS) ou NVDA (Windows)

---

## 13. Variables d'environnement

### 13.1 Variables publiques (exposées au navigateur)

| Clé | Description | Exemple |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase (RLS la protège) | `eyJhbGci...` |
| `NEXT_PUBLIC_SITE_URL` | URL canonique du site | `https://solimouv.app` |
| `NEXT_PUBLIC_FESTIVAL_DATE` | Date du festival (pour countdown) | `2026-07-11T10:00:00Z` |

### 13.2 Variables serveur (secrètes)

| Clé | Description |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Clé admin Supabase — **jamais exposée au client** |
| `MAKE_WEBHOOK_URL` | URL du webhook Make pour notifs |
| `ADMIN_SEED_EMAIL` | Email du premier admin à créer au seed |

### 13.3 Fichier `.env.example`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FESTIVAL_DATE=2026-07-11T10:00:00Z

# Intégrations
MAKE_WEBHOOK_URL=

# Seed
ADMIN_SEED_EMAIL=admin@solimouv.app
```

---

## 14. Déploiement

### 14.1 Environnements

| Environnement | Branche | URL |
|---|---|---|
| Production | `main` (tag) | `https://solimouv.app` |
| Staging | `develop` | `https://develop-solimouv.vercel.app` |
| Preview | PR | URL auto Vercel |

### 14.2 Pipeline

1. Push sur `feature/*` → CI (lint + typecheck + build)
2. PR vers `develop` → Preview Deployment Vercel
3. Merge dans `develop` → déploie staging
4. Merge dans `main` + tag → déploie production

Voir [`DEPLOYMENT.md`](./DEPLOYMENT.md) pour les commandes détaillées.

---

## 15. Versions & roadmap

### v0.1 — Socle minimal (H+9)
- [x] PWA installable + manifest + service worker
- [x] 5 pages publiques (Accueil, À propos, Programme, Associations, Contact)
- [x] SEO de base (Metadata, sitemap, robots, Schema.org)
- [x] Responsive mobile-first
- [x] Lighthouse > 70 sur les 4 axes

### v0.2 — Briques complémentaires (H+19)
- [ ] Auth utilisateur + espace `/compte`
- [ ] Formulaire inscription + matching WASM Rust
- [ ] Système passeport (saisie code + paliers)
- [ ] Admin : auth, CRUD, dashboard live

### v1.0 — Livraison finale (H+24)
- [ ] Documentation complète
- [ ] Guide utilisateur organisateurs
- [ ] Charte graphique livrée
- [ ] Démo vidéo
- [ ] Lighthouse > 90 partout

### Post-hackathon (roadmap ouverte)
- Scanner QR code pour codes stands
- Géolocalisation & plan interactif du site
- Notifications push Web
- Multi-langue (FR/EN/AR)
- Synthèse vocale des pages

---

## 16. Décisions techniques (ADR légers)

### ADR-001 : Next.js plutôt que full Rust (Leptos)

**Contexte** : Le référent propose un bonus "tout en Rust".

**Décision** : Next.js + module Rust/WASM isolé.

**Pourquoi** :
- Socle minimal SM-1 et SM-2 exige PWA, SEO, perf — Next.js fait tout ça nativement
- Fenêtre de 24h + un seul dev tech + débutant Rust → full Rust = risque élevé de ne pas finir le socle
- Hybride permet de démontrer la maîtrise Rust sur une brique crédible (matching) sans compromettre la livraison obligatoire

### ADR-002 : Supabase plutôt que backend custom

**Contexte** : Besoin BDD + Auth + en 24h.

**Décision** : Supabase (Postgres + Auth + RLS).

**Pourquoi** :
- Auth, DB, storage en un seul service
- Pas de code backend custom à écrire pour les CRUD
- RLS = sécurité déclarative, pas de middleware à écrire
- Compatible avec la BDD Postgres si besoin de migrer vers auto-hébergé plus tard

### ADR-003 : pnpm workspaces plutôt que repo plat

**Contexte** : Besoin de cohabitation entre `apps/web/` (Next.js) et `crates/matching/` (Rust).

**Décision** : Monorepo pnpm avec `apps/` et `crates/`.

**Pourquoi** :
- Sépare proprement JS/TS et Rust
- Permet d'ajouter d'autres apps plus tard (ex: `apps/mobile/` ou `apps/landing/`)
- Conventions industrie (Turborepo, Nx) facilement migrables

### ADR-004 : localStorage + DB pour le passeport

**Contexte** : Le passeport doit fonctionner pour utilisateurs anonymes ET connectés.

**Décision** : Progression stockée en localStorage (optimistic UI), synchronisée en DB si compte.

**Pourquoi** :
- UX immédiate (pas d'attente réseau)
- Fonctionne offline (cohérent PWA)
- Persistance cross-device si compte utilisateur

### ADR-005 : Git Flow allégé

**Contexte** : Le référent impose une structure Git Flow.

**Décision** : `main` + `develop` + `feature/*`, pas de `release/*` ni `hotfix/*`.

**Pourquoi** :
- Respecte l'esprit Git Flow (branches de fonctionnalité, `develop` tampon)
- Évite la surcharge de merges pour 24h
- `hotfix` sera créée ad-hoc si bug critique pendant la démo

---

_Document maintenu par le Tech Lead. Dernière mise à jour : début du hackathon._
