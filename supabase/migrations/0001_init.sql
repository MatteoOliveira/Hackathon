-- ============================================================
-- 0001_init.sql — Schéma initial Solimouv' 2026
-- À exécuter dans : Supabase → SQL Editor
-- ============================================================

-- Profils utilisateurs (lié à auth.users de Supabase)
CREATE TABLE IF NOT EXISTS profiles (
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
CREATE TABLE IF NOT EXISTS associations (
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
CREATE TABLE IF NOT EXISTS sports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  niveau_requis TEXT DEFAULT 'débutant'
    CHECK (niveau_requis IN ('débutant', 'intermédiaire', 'confirmé', 'tous_niveaux')),
  materiel_requis TEXT[],
  accessibilite_handicap BOOLEAN DEFAULT false,
  accessibilite_debutant BOOLEAN DEFAULT true,
  intensite INT CHECK (intensite BETWEEN 1 AND 5),
  type_activite TEXT[] DEFAULT '{}',  -- ['collectif', 'individuel', 'interieur', 'exterieur']
  tags TEXT[] DEFAULT '{}',            -- pour le matching WASM
  icon TEXT,                           -- emoji ou code icône
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Liaison sports ↔ associations (N:M)
CREATE TABLE IF NOT EXISTS sport_associations (
  sport_id UUID REFERENCES sports(id) ON DELETE CASCADE,
  association_id UUID REFERENCES associations(id) ON DELETE CASCADE,
  PRIMARY KEY (sport_id, association_id)
);

-- Ateliers / sessions du festival
CREATE TABLE IF NOT EXISTS ateliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id UUID REFERENCES sports(id) ON DELETE SET NULL,
  association_id UUID REFERENCES associations(id) ON DELETE SET NULL,
  titre TEXT NOT NULL,
  description TEXT,
  horaire_debut TIMESTAMPTZ NOT NULL,
  horaire_fin TIMESTAMPTZ NOT NULL,
  lieu TEXT NOT NULL,
  capacite_max INT DEFAULT 30,
  public_cible TEXT[] DEFAULT '{}',   -- ['familles', 'jeunes', 'seniors', ...]
  code_stand TEXT UNIQUE NOT NULL,    -- code à saisir dans le passeport (6 majuscules)
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inscriptions au festival (utilisateurs authentifiés OU anonymes)
CREATE TABLE IF NOT EXISTS inscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- null si anonyme
  email TEXT,                             -- requis si anonyme
  prenom TEXT NOT NULL,
  tranche_age TEXT,
  centres_interet TEXT[] DEFAULT '{}',
  besoins_accessibilite TEXT[] DEFAULT '{}',
  sports_recommandes UUID[] DEFAULT '{}', -- résultat du matching
  consent_notifs BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT inscriptions_user_or_email CHECK (user_id IS NOT NULL OR email IS NOT NULL)
);

-- Check-ins du passeport
CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inscription_id UUID REFERENCES inscriptions(id) ON DELETE CASCADE,
  atelier_id UUID REFERENCES ateliers(id) ON DELETE CASCADE,
  code_saisi TEXT NOT NULL,
  palier_debloque TEXT,               -- 'bronze' | 'argent' | 'or' | 'platine'
  horodatage TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (inscription_id, atelier_id) -- un seul check-in par atelier et par inscription
);

-- Messages du formulaire de contact
CREATE TABLE IF NOT EXISTS messages_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  sujet TEXT,
  message TEXT NOT NULL,
  traite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuration globale (éditable par admin, lue partout)
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VALEURS INITIALES DE CONFIG
-- ============================================================
INSERT INTO config (key, value) VALUES
  ('edition',          '{"numero": 2, "annee": 2026}'),
  ('date_festival',    '"2026-07-11T10:00:00Z"'),
  ('lieu_festival',    '"Centre Sportif Charles Moureu, Paris"'),
  ('festival_actif',   'false'),
  ('paliers_passeport', '{"bronze": 3, "argent": 6, "or": 10, "platine": 13}')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- INDEX POUR LES REQUÊTES FRÉQUENTES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_ateliers_horaire ON ateliers(horaire_debut);
CREATE INDEX IF NOT EXISTS idx_ateliers_code ON ateliers(code_stand);
CREATE INDEX IF NOT EXISTS idx_inscriptions_user ON inscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_inscription ON checkins(inscription_id);
CREATE INDEX IF NOT EXISTS idx_associations_slug ON associations(slug);
CREATE INDEX IF NOT EXISTS idx_sports_slug ON sports(slug);

-- ============================================================
-- TRIGGER updated_at AUTOMATIQUE
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER associations_updated_at
  BEFORE UPDATE ON associations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER config_updated_at
  BEFORE UPDATE ON config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TRIGGER : créer le profil automatiquement à l'inscription Supabase Auth
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, prenom)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'prenom', 'Participant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Tables publiques en lecture
ALTER TABLE associations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "associations_public_read" ON associations
  FOR SELECT USING (actif = true);
CREATE POLICY "associations_admin_write" ON associations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sports_public_read" ON sports FOR SELECT USING (true);
CREATE POLICY "sports_admin_write" ON sports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

ALTER TABLE sport_associations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sport_associations_public_read" ON sport_associations FOR SELECT USING (true);
CREATE POLICY "sport_associations_admin_write" ON sport_associations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

ALTER TABLE ateliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ateliers_public_read" ON ateliers
  FOR SELECT USING (actif = true);
CREATE POLICY "ateliers_admin_write" ON ateliers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

ALTER TABLE config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "config_public_read" ON config FOR SELECT USING (true);
CREATE POLICY "config_admin_write" ON config
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Profils utilisateurs
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_self_read" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_self_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_read" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
CREATE POLICY "profiles_admin_write" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Inscriptions
ALTER TABLE inscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inscriptions_public_insert" ON inscriptions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "inscriptions_self_read" ON inscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "inscriptions_admin_read" ON inscriptions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Check-ins
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

-- Messages de contact : insertion publique, lecture admin uniquement
ALTER TABLE messages_contact ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_contact_public_insert" ON messages_contact
  FOR INSERT WITH CHECK (true);
CREATE POLICY "messages_contact_admin_read" ON messages_contact
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
CREATE POLICY "messages_contact_admin_update" ON messages_contact
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
