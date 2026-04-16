# 🏃 Solimouv' PWA

> Progressive Web App du festival **Solimouv'** — le festival du sport inclusif pour toutes et tous, organisé par [Up Sport!](https://www.unispourlesport.paris/) et son collectif d'associations parisiennes.

**Application web installable (mobile & desktop), pensée pour faire connaître le festival, engager les publics, et piloter l'événement en temps réel.**

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Démarrage rapide](#-démarrage-rapide)
- [Structure du repo](#-structure-du-repo)
- [Scripts disponibles](#-scripts-disponibles)
- [Déploiement](#-déploiement)
- [Git Flow](#-git-flow)
- [Documentation](#-documentation)
- [Équipe](#-équipe)
- [Licence](#-licence)

---

## 🎯 À propos

**Solimouv'** est le festival du sport pour tous. La 1ʳᵉ édition (12 juillet 2025, Centre Sportif Charles Moureu) a réuni plus de 500 participants, 13 associations partenaires et 40 bénévoles.

**Cette PWA répond à 6 enjeux** :

1. **Visibilité & Notoriété** — faire connaître Solimouv' au-delà du cercle actuel
2. **Engagement** — expérience interactive qui donne envie de participer
3. **Pilotage** — outil de gestion temps réel pour les organisateurs
4. **Matching** — aider chaque personne à trouver un sport qui lui correspond
5. **Pérennité** — réutilisable d'une édition à l'autre, pas un one-shot
6. **Inclusivité** — chaque choix de design/contenu reflète l'accessibilité et l'inclusion

---

## ✨ Fonctionnalités

### Socle minimal (SM-1 à SM-5)

- 📱 **PWA installable** sur mobile et desktop (manifest + service worker)
- 🎨 **Design responsive** mobile-first, charte graphique dédiée
- 🌐 **5 pages publiques** : Accueil, À propos, Programme, Associations partenaires, Contact
- 🔍 **SEO optimisé** : Schema.org, Open Graph, sitemap, structure sémantique
- ♿ **Accessibilité AA** (WCAG 2.1) : contrastes, navigation clavier, alt text, réduction d'animations
- 📊 **Performance** : Lighthouse > 90 (objectif > 70 requis)

### Briques complémentaires

- ⏳ **Compte à rebours** animé avant l'ouverture du festival
- 👤 **Comptes utilisateurs** : inscription, connexion, espace personnel
- 🧩 **Matching sport ↔ profil** : formulaire de découverte, algorithme en Rust compilé en WebAssembly
- 🎫 **Passeport sportif** : système de codes à collecter auprès de chaque stand, paliers Bronze/Argent/Or/Platine
- 🛠️ **Espace admin** : auth dédiée, gestion de contenu, dashboard de pilotage temps réel
- 🔔 **Notifications personnalisées** (via Make) selon profil et centres d'intérêt

---

## 🛠️ Stack technique

| Couche | Technologie | Rôle |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSR/SSG, routing, API routes |
| **Langage** | TypeScript | Typage strict |
| **Styling** | Tailwind CSS + shadcn/ui | Design system |
| **PWA** | @serwist/next | Manifest + service worker |
| **BDD** | Supabase (PostgreSQL) | Données + Row Level Security |
| **Auth** | Supabase Auth | Utilisateurs + admins |
| **Calcul intensif** | Rust + WebAssembly | Algo de matching côté client |
| **Forms** | react-hook-form + zod | Validation de formulaires |
| **Hébergement** | Vercel | Déploiement continu depuis GitHub |
| **Automatisation** | Make | Notifications, webhooks |

**Pourquoi cette stack ?** Voir [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md#décisions-techniques).

---

## 📦 Prérequis

Avant de démarrer, installe les outils suivants :

- **Node.js** ≥ 20.x → [nodejs.org](https://nodejs.org/)
- **pnpm** ≥ 9.x → `npm install -g pnpm`
- **Git** → [git-scm.com](https://git-scm.com/)
- **Rust toolchain** (pour le module WASM) → [rustup.rs](https://rustup.rs/)
- **wasm-pack** → `cargo install wasm-pack`
- **Compte Supabase** (gratuit) → [supabase.com](https://supabase.com/)
- **Compte Vercel** (gratuit) → [vercel.com](https://vercel.com/)

Vérifier l'installation :
```bash
node --version    # v20.x.x
pnpm --version    # 9.x.x
cargo --version   # cargo 1.x.x
wasm-pack --version
```

---

## 🚀 Démarrage rapide

### 1. Cloner le repo

```bash
git clone https://github.com/<org>/solimouv.git
cd solimouv
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configurer les variables d'environnement

Copier le fichier d'exemple :
```bash
cp .env.example .env.local
```

Remplir les variables dans `.env.local` (voir [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md#variables-denvironnement)) :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...         # usage serveur uniquement
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FESTIVAL_DATE=2026-07-11T10:00:00Z
```

### 4. Initialiser la base de données Supabase

Exécuter les migrations dans l'interface SQL de Supabase :
```bash
# Contenu à copier depuis :
cat supabase/migrations/0001_init.sql
# puis exécuter dans Supabase → SQL Editor
```

Optionnel : charger les données de démo :
```bash
cat supabase/seed.sql
# à exécuter dans Supabase → SQL Editor
```

### 5. Compiler le module WASM

```bash
pnpm wasm:build
```

Cette commande compile `crates/matching/` vers `apps/web/public/wasm/`.

### 6. Lancer le serveur de développement

```bash
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

---

## 📁 Structure du repo

```
solimouv/
├── .github/
│   └── workflows/          # CI GitHub Actions
├── apps/
│   └── web/                # Application Next.js
│       ├── app/            # Routes (App Router)
│       │   ├── (public)/   # Pages publiques
│       │   ├── compte/     # Espace utilisateur (protégé)
│       │   ├── admin/      # Espace admin (protégé)
│       │   └── api/        # Routes API
│       ├── components/     # Composants React
│       ├── lib/            # Utilitaires, clients Supabase, bindings WASM
│       ├── public/         # Assets statiques + icônes PWA + .wasm compilé
│       └── ...
├── crates/
│   └── matching/           # Code Rust compilé en WASM
│       ├── src/lib.rs
│       └── Cargo.toml
├── supabase/
│   ├── migrations/         # Schéma SQL versionné
│   └── seed.sql            # Données de démo
├── docs/
│   ├── ARCHITECTURE.md     # Architecture technique détaillée
│   ├── DEPLOYMENT.md       # Guide de déploiement
│   ├── USER_GUIDE.md       # Guide utilisateur pour les organisateurs
│   └── BRAND.md            # Charte graphique
├── .env.example
├── .gitignore
├── package.json            # Monorepo (workspaces pnpm)
├── pnpm-workspace.yaml
└── README.md
```

Détails dans [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

---

## 🧰 Scripts disponibles

Depuis la racine du monorepo :

| Commande | Description |
|---|---|
| `pnpm dev` | Serveur de dev Next.js (port 3000) |
| `pnpm build` | Build production |
| `pnpm start` | Serveur production local |
| `pnpm lint` | ESLint sur tout le code TS |
| `pnpm wasm:build` | Compile `crates/matching/` en WASM |
| `pnpm wasm:test` | Tests unitaires Rust |
| `pnpm typecheck` | Vérification TypeScript |

---

## 🚢 Déploiement

### Production (Vercel)

Le déploiement est automatique à chaque push sur `main`.

1. Connecter le repo à Vercel → [vercel.com/new](https://vercel.com/new)
2. Configurer les variables d'environnement (onglet Settings → Environment Variables)
3. Définir les commandes de build :
   ```
   Install Command : pnpm install
   Build Command   : pnpm wasm:build && pnpm build
   Output Directory: apps/web/.next
   ```
4. Activer les **Preview Deployments** pour les PRs.

### Environnements

- **Production** → `main` → `https://solimouv.app`
- **Staging** → `develop` → `https://develop-solimouv.vercel.app`
- **Preview** → toute PR → URL générée automatiquement

Voir [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) pour le détail.

---

## 🌿 Git Flow

Le projet suit une version **allégée** de Git Flow :

```
main              ← versions taguées uniquement (v0.1, v0.2, v1.0)
 └── develop      ← branche d'intégration
      ├── feature/setup-nextjs-pwa
      ├── feature/supabase-schema
      ├── feature/matching-wasm
      └── feature/...
```

### Conventions

- **Branches** : `feature/kebab-case-description`
- **Commits** : format [Conventional Commits](https://www.conventionalcommits.org/)
  ```
  feat(matching): add Rust WASM scoring algorithm
  fix(pwa): correct manifest icon paths
  docs(readme): add deployment section
  chore(deps): bump next to 15.2
  ```
- **PR** : cible `develop`, review avant merge, squash préféré
- **Versions** : sémantique (`v0.1` socle, `v0.2` briques complémentaires, `v1.0` livraison finale)

---

## 📚 Documentation

| Fichier | Pour qui |
|---|---|
| [`README.md`](./README.md) | Tout le monde (onboarding) |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Développeurs |
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) | Ops / déployeurs |
| [`docs/USER_GUIDE.md`](./docs/USER_GUIDE.md) | Organisateurs Up Sport! |
| [`docs/BRAND.md`](./docs/BRAND.md) | Designers / communicants |

---

## 👥 Équipe

Projet réalisé dans le cadre d'un hackathon de 24h au profit d'Up Sport!.

- **Tech Lead** : _[à compléter]_
- **Design / Charte graphique** : _[à compléter]_
- **Contenu & Stratégie RS** : _[à compléter]_
- **Automatisation (Make)** : _[à compléter]_
- **Référent technique** : _[à compléter]_

---

## 📄 Licence

_[À définir avec le client — recommandé : MIT pour le code, CC BY-NC-SA 4.0 pour les contenus graphiques]_

---

## 🙏 Remerciements

- **Up Sport!** pour la mission et la confiance
- Les **13 associations partenaires** de l'édition 1
- Les **40 bénévoles** qui ont rendu Solimouv' 2025 possible
- **Anthropic** pour la mise à disposition de Claude Max

---

_Fait avec 💙 pour un sport accessible à toutes et tous._
