-- ============================================================
-- 0002_fix_rls_recursion.sql
-- Corrige la récursion infinie dans les policies RLS
-- À exécuter dans Supabase → SQL Editor
-- ============================================================

-- ── 1. Fonction SECURITY DEFINER pour vérifier le rôle admin ──
-- Cette fonction s'exécute avec les droits de son owner (bypass RLS)
-- évitant toute récursion quand on vérifie le rôle depuis une policy
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
$$;

-- ── 2. Supprimer les policies problématiques ──────────────────

-- profiles
DROP POLICY IF EXISTS "profiles_admin_read"  ON profiles;
DROP POLICY IF EXISTS "profiles_admin_write" ON profiles;

-- associations
DROP POLICY IF EXISTS "associations_admin_write" ON associations;

-- sports
DROP POLICY IF EXISTS "sports_admin_write" ON sports;

-- sport_associations
DROP POLICY IF EXISTS "sport_associations_admin_write" ON sport_associations;

-- ateliers
DROP POLICY IF EXISTS "ateliers_admin_write" ON ateliers;

-- config
DROP POLICY IF EXISTS "config_admin_write" ON config;

-- inscriptions
DROP POLICY IF EXISTS "inscriptions_admin_read" ON inscriptions;

-- checkins
DROP POLICY IF EXISTS "checkins_admin_read" ON checkins;

-- messages_contact
DROP POLICY IF EXISTS "messages_contact_admin_read"   ON messages_contact;
DROP POLICY IF EXISTS "messages_contact_admin_update" ON messages_contact;

-- ── 3. Recréer les policies avec is_admin() ───────────────────

-- profiles
CREATE POLICY "profiles_admin_read" ON profiles
  FOR SELECT USING (is_admin());

CREATE POLICY "profiles_admin_write" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- associations : séparer lecture publique et écriture admin
-- (FOR ALL sur la policy write causait le SELECT en double)
CREATE POLICY "associations_admin_write" ON associations
  FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "associations_admin_update" ON associations
  FOR UPDATE USING (is_admin());
CREATE POLICY "associations_admin_delete" ON associations
  FOR DELETE USING (is_admin());

-- sports
CREATE POLICY "sports_admin_write" ON sports
  FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "sports_admin_update" ON sports
  FOR UPDATE USING (is_admin());
CREATE POLICY "sports_admin_delete" ON sports
  FOR DELETE USING (is_admin());

-- sport_associations
CREATE POLICY "sport_associations_admin_write" ON sport_associations
  FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "sport_associations_admin_delete" ON sport_associations
  FOR DELETE USING (is_admin());

-- ateliers
CREATE POLICY "ateliers_admin_write" ON ateliers
  FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "ateliers_admin_update" ON ateliers
  FOR UPDATE USING (is_admin());
CREATE POLICY "ateliers_admin_delete" ON ateliers
  FOR DELETE USING (is_admin());

-- config
CREATE POLICY "config_admin_write" ON config
  FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "config_admin_update" ON config
  FOR UPDATE USING (is_admin());

-- inscriptions
CREATE POLICY "inscriptions_admin_read" ON inscriptions
  FOR SELECT USING (is_admin());

-- checkins
CREATE POLICY "checkins_admin_read" ON checkins
  FOR SELECT USING (is_admin());

-- messages_contact
CREATE POLICY "messages_contact_admin_read" ON messages_contact
  FOR SELECT USING (is_admin());
CREATE POLICY "messages_contact_admin_update" ON messages_contact
  FOR UPDATE USING (is_admin());
