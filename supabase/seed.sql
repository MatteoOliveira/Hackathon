-- ============================================================
-- seed.sql — Données de démonstration Solimouv' 2026
-- À exécuter APRÈS 0001_init.sql
-- ============================================================

-- ── Associations partenaires (13) ──────────────────────────
INSERT INTO associations (nom, slug, description, couleur_theme, ordre_affichage) VALUES
  ('Handisport Paris 13', 'handisport-paris-13',
   'Association dédiée à la pratique sportive des personnes en situation de handicap moteur et sensoriel.',
   '#4F46E5', 1),
  ('Sport et Intégration', 'sport-et-integration',
   'Accompagne les personnes éloignées du sport vers une pratique régulière dans un cadre bienveillant.',
   '#7C3AED', 2),
  ('Paris Tennis Club Inclusif', 'paris-tennis-club-inclusif',
   'Courts de tennis adaptés à tous les niveaux et toutes les situations.',
   '#DB2777', 3),
  ('Basket Fauteuil 75', 'basket-fauteuil-75',
   'Premier club de basket en fauteuil roulant du 13e arrondissement.',
   '#D97706', 4),
  ('Natation Pour Tous', 'natation-pour-tous',
   'Cours de natation adaptés pour débutants, seniors et personnes handicapées.',
   '#0891B2', 5),
  ('Yoga Solidaire Paris', 'yoga-solidaire-paris',
   'Séances de yoga sur don libre, accessibles à toutes et tous.',
   '#059669', 6),
  ('Escrime Adaptée IDF', 'escrime-adaptee-idf',
   'Pratique de l''escrime adaptée pour valides et personnes handicapées.',
   '#DC2626', 7),
  ('Course à Pied Citoyenne', 'course-a-pied-citoyenne',
   'Groupe de course inclusive qui mêle coureurs valides et en fauteuil.',
   '#EA580C', 8),
  ('Foot Sans Frontières', 'foot-sans-frontieres',
   'Football inclusif qui rassemble toutes origines, genres et capacités.',
   '#16A34A', 9),
  ('Danse Libre Paris', 'danse-libre-paris',
   'Ateliers de danse contemporaine ouverts à tous, y compris en fauteuil roulant.',
   '#9333EA', 10),
  ('Gym Douce Séniors', 'gym-douce-seniors',
   'Séances de gymnastique douce spécialement conçues pour les personnes de plus de 60 ans.',
   '#CA8A04', 11),
  ('Escalade Tous Niveaux', 'escalade-tous-niveaux',
   'Salle d''escalade indoor avec parcours adaptés aux débutants et aux personnes handicapées.',
   '#0F766E', 12),
  ('Arts Martiaux Adaptés', 'arts-martiaux-adaptes',
   'Judo, aïkido et self-défense adaptés, quel que soit l''âge ou le niveau de mobilité.',
   '#BE123C', 13)
ON CONFLICT (slug) DO NOTHING;

-- ── Sports (15) ──────────────────────────────────────────────
INSERT INTO sports (nom, slug, description, niveau_requis, accessibilite_handicap, accessibilite_debutant, intensite, type_activite, tags, icon) VALUES
  ('Basket en fauteuil', 'basket-fauteuil',
   'Basket-ball pratiqué en fauteuil roulant, ouvert à tous.',
   'tous_niveaux', true, true, 3, ARRAY['collectif', 'interieur'],
   ARRAY['collectif', 'balle', 'fauteuil', 'handicap'], '🏀'),
  ('Tennis de table adapté', 'tennis-table-adapte',
   'Ping-pong accessible à toutes les mobilités.',
   'débutant', true, true, 2, ARRAY['individuel', 'interieur'],
   ARRAY['individuel', 'raquette', 'reflexes'], '🏓'),
  ('Natation inclusive', 'natation-inclusive',
   'Cours de natation adaptés à tous niveaux et toutes mobilités.',
   'débutant', true, true, 2, ARRAY['individuel', 'aquatique'],
   ARRAY['aquatique', 'endurance', 'detente'], '🏊'),
  ('Yoga', 'yoga',
   'Yoga accessible à tous, adapté si besoin.',
   'débutant', true, true, 1, ARRAY['individuel', 'interieur'],
   ARRAY['detente', 'souplesse', 'meditation', 'mental'], '🧘'),
  ('Course à pied', 'course-a-pied',
   'Running inclusif pour tous les niveaux.',
   'débutant', false, true, 3, ARRAY['individuel', 'exterieur'],
   ARRAY['endurance', 'exterieur', 'cardio'], '🏃'),
  ('Football', 'football',
   'Football en équipe, tous niveaux.',
   'débutant', false, true, 4, ARRAY['collectif', 'exterieur'],
   ARRAY['collectif', 'balle', 'endurance', 'cardio'], '⚽'),
  ('Escrime adaptée', 'escrime-adaptee',
   'Escrime ouverte aux valides et aux personnes en fauteuil.',
   'débutant', true, true, 3, ARRAY['individuel', 'interieur'],
   ARRAY['reflexes', 'concentration', 'handicap', 'strategie'], '🤺'),
  ('Danse inclusive', 'danse-inclusive',
   'Ateliers de danse contemporaine accessibles à tous.',
   'débutant', true, true, 2, ARRAY['collectif', 'interieur'],
   ARRAY['danse', 'creativite', 'collectif', 'expression'], '💃'),
  ('Escalade', 'escalade',
   'Escalade indoor sur voie et blocs, tous niveaux.',
   'débutant', false, true, 4, ARRAY['individuel', 'interieur'],
   ARRAY['force', 'grimper', 'concentration', 'souplesse'], '🧗'),
  ('Judo adapté', 'judo-adapte',
   'Judo pour tous, adapté aux personnes en situation de handicap.',
   'débutant', true, true, 3, ARRAY['individuel', 'interieur'],
   ARRAY['combat', 'force', 'discipline', 'handicap'], '🥋'),
  ('Gym douce', 'gym-douce',
   'Exercices doux pour maintenir la forme, idéal pour les seniors.',
   'débutant', true, true, 1, ARRAY['collectif', 'interieur'],
   ARRAY['seniors', 'detente', 'souplesse', 'mobilite'], '🤸'),
  ('Tennis', 'tennis',
   'Tennis adapté à toutes les mobilités.',
   'débutant', true, true, 3, ARRAY['individuel', 'exterieur'],
   ARRAY['raquette', 'reflexes', 'cardio'], '🎾'),
  ('Tir à l''arc', 'tir-arc',
   'Tir à l''arc handisport et valide, en position debout ou assise.',
   'débutant', true, true, 2, ARRAY['individuel', 'interieur'],
   ARRAY['concentration', 'precision', 'handicap'], '🏹'),
  ('Volleyball assis', 'volleyball-assis',
   'Volleyball pratiqué en position assise, accessible à tous.',
   'débutant', true, true, 3, ARRAY['collectif', 'interieur'],
   ARRAY['collectif', 'balle', 'reflexes', 'handicap'], '🏐'),
  ('Badminton', 'badminton',
   'Badminton pour tous les niveaux, en double ou simple.',
   'débutant', false, true, 3, ARRAY['individuel', 'interieur'],
   ARRAY['raquette', 'reflexes', 'cardio', 'agilite'], '🏸')
ON CONFLICT (slug) DO NOTHING;

-- ── Liaisons sport ↔ associations ─────────────────────────
-- (simplifié : chaque asso propose 2-3 sports)
DO $$
DECLARE
  v_basket UUID; v_tennis_table UUID; v_natation UUID; v_yoga UUID;
  v_course UUID; v_foot UUID; v_escrime UUID; v_danse UUID;
  v_escalade UUID; v_judo UUID; v_gym UUID; v_tennis UUID;

  v_handisport UUID; v_sport_integ UUID; v_tennis_club UUID;
  v_basket_f UUID; v_natation_tous UUID; v_yoga_sol UUID;
  v_escrime_idf UUID; v_course_cit UUID; v_foot_sf UUID;
  v_danse_libre UUID; v_gym_sen UUID; v_escalade_tn UUID;
  v_arts_martiaux UUID;
BEGIN
  SELECT id INTO v_basket FROM sports WHERE slug = 'basket-fauteuil';
  SELECT id INTO v_tennis_table FROM sports WHERE slug = 'tennis-table-adapte';
  SELECT id INTO v_natation FROM sports WHERE slug = 'natation-inclusive';
  SELECT id INTO v_yoga FROM sports WHERE slug = 'yoga';
  SELECT id INTO v_course FROM sports WHERE slug = 'course-a-pied';
  SELECT id INTO v_foot FROM sports WHERE slug = 'football';
  SELECT id INTO v_escrime FROM sports WHERE slug = 'escrime-adaptee';
  SELECT id INTO v_danse FROM sports WHERE slug = 'danse-inclusive';
  SELECT id INTO v_escalade FROM sports WHERE slug = 'escalade';
  SELECT id INTO v_judo FROM sports WHERE slug = 'judo-adapte';
  SELECT id INTO v_gym FROM sports WHERE slug = 'gym-douce';
  SELECT id INTO v_tennis FROM sports WHERE slug = 'tennis';

  SELECT id INTO v_handisport FROM associations WHERE slug = 'handisport-paris-13';
  SELECT id INTO v_sport_integ FROM associations WHERE slug = 'sport-et-integration';
  SELECT id INTO v_tennis_club FROM associations WHERE slug = 'paris-tennis-club-inclusif';
  SELECT id INTO v_basket_f FROM associations WHERE slug = 'basket-fauteuil-75';
  SELECT id INTO v_natation_tous FROM associations WHERE slug = 'natation-pour-tous';
  SELECT id INTO v_yoga_sol FROM associations WHERE slug = 'yoga-solidaire-paris';
  SELECT id INTO v_escrime_idf FROM associations WHERE slug = 'escrime-adaptee-idf';
  SELECT id INTO v_course_cit FROM associations WHERE slug = 'course-a-pied-citoyenne';
  SELECT id INTO v_foot_sf FROM associations WHERE slug = 'foot-sans-frontieres';
  SELECT id INTO v_danse_libre FROM associations WHERE slug = 'danse-libre-paris';
  SELECT id INTO v_gym_sen FROM associations WHERE slug = 'gym-douce-seniors';
  SELECT id INTO v_escalade_tn FROM associations WHERE slug = 'escalade-tous-niveaux';
  SELECT id INTO v_arts_martiaux FROM associations WHERE slug = 'arts-martiaux-adaptes';

  INSERT INTO sport_associations (sport_id, association_id) VALUES
    (v_basket, v_handisport), (v_basket, v_basket_f),
    (v_tennis_table, v_handisport), (v_tennis_table, v_sport_integ),
    (v_natation, v_natation_tous),
    (v_yoga, v_yoga_sol), (v_yoga, v_sport_integ),
    (v_course, v_course_cit),
    (v_foot, v_foot_sf),
    (v_escrime, v_escrime_idf),
    (v_danse, v_danse_libre),
    (v_gym, v_gym_sen),
    (v_escalade, v_escalade_tn),
    (v_judo, v_arts_martiaux),
    (v_tennis, v_tennis_club)
  ON CONFLICT DO NOTHING;
END $$;

-- ── Ateliers (programme du 11 juillet 2026) ───────────────
DO $$
DECLARE
  v_basket UUID; v_yoga UUID; v_course UUID; v_foot UUID;
  v_natation UUID; v_danse UUID; v_escalade UUID;
  v_basket_f UUID; v_yoga_sol UUID; v_course_cit UUID;
  v_foot_sf UUID; v_natation_tous UUID; v_danse_libre UUID;
  v_escalade_tn UUID;
BEGIN
  SELECT id INTO v_basket FROM sports WHERE slug = 'basket-fauteuil';
  SELECT id INTO v_yoga FROM sports WHERE slug = 'yoga';
  SELECT id INTO v_course FROM sports WHERE slug = 'course-a-pied';
  SELECT id INTO v_foot FROM sports WHERE slug = 'football';
  SELECT id INTO v_natation FROM sports WHERE slug = 'natation-inclusive';
  SELECT id INTO v_danse FROM sports WHERE slug = 'danse-inclusive';
  SELECT id INTO v_escalade FROM sports WHERE slug = 'escalade';

  SELECT id INTO v_basket_f FROM associations WHERE slug = 'basket-fauteuil-75';
  SELECT id INTO v_yoga_sol FROM associations WHERE slug = 'yoga-solidaire-paris';
  SELECT id INTO v_course_cit FROM associations WHERE slug = 'course-a-pied-citoyenne';
  SELECT id INTO v_foot_sf FROM associations WHERE slug = 'foot-sans-frontieres';
  SELECT id INTO v_natation_tous FROM associations WHERE slug = 'natation-pour-tous';
  SELECT id INTO v_danse_libre FROM associations WHERE slug = 'danse-libre-paris';
  SELECT id INTO v_escalade_tn FROM associations WHERE slug = 'escalade-tous-niveaux';

  INSERT INTO ateliers (sport_id, association_id, titre, horaire_debut, horaire_fin, lieu, capacite_max, public_cible, code_stand) VALUES
    (v_basket, v_basket_f, 'Initiation basket en fauteuil',
     '2026-07-11T10:00:00+02:00', '2026-07-11T11:30:00+02:00',
     'Gymnase A', 20, ARRAY['tous', 'handicap'], 'BKT001'),
    (v_yoga, v_yoga_sol, 'Yoga du matin',
     '2026-07-11T10:00:00+02:00', '2026-07-11T11:00:00+02:00',
     'Salle polyvalente', 30, ARRAY['tous', 'seniors'], 'YOG001'),
    (v_course, v_course_cit, 'Course 5km inclusive',
     '2026-07-11T09:30:00+02:00', '2026-07-11T11:00:00+02:00',
     'Piste extérieure', 50, ARRAY['tous'], 'CRS001'),
    (v_foot, v_foot_sf, 'Tournoi foot inclusif',
     '2026-07-11T11:00:00+02:00', '2026-07-11T13:00:00+02:00',
     'Terrain de foot', 40, ARRAY['jeunes', 'tous'], 'FBL001'),
    (v_natation, v_natation_tous, 'Natation accessible',
     '2026-07-11T11:00:00+02:00', '2026-07-11T12:30:00+02:00',
     'Piscine', 15, ARRAY['tous', 'handicap', 'seniors'], 'NAT001'),
    (v_yoga, v_yoga_sol, 'Yoga de l''après-midi',
     '2026-07-11T14:00:00+02:00', '2026-07-11T15:00:00+02:00',
     'Salle polyvalente', 30, ARRAY['tous', 'seniors'], 'YOG002'),
    (v_danse, v_danse_libre, 'Atelier danse inclusive',
     '2026-07-11T14:00:00+02:00', '2026-07-11T15:30:00+02:00',
     'Studio danse', 25, ARRAY['tous', 'handicap'], 'DNS001'),
    (v_basket, v_basket_f, 'Match de basket fauteuil',
     '2026-07-11T15:00:00+02:00', '2026-07-11T17:00:00+02:00',
     'Gymnase A', 24, ARRAY['tous'], 'BKT002'),
    (v_escalade, v_escalade_tn, 'Initiation escalade',
     '2026-07-11T13:00:00+02:00', '2026-07-11T15:00:00+02:00',
     'Mur d''escalade', 12, ARRAY['jeunes', 'tous'], 'ESC001'),
    (v_foot, v_foot_sf, 'Football féminin & mixte',
     '2026-07-11T14:00:00+02:00', '2026-07-11T16:00:00+02:00',
     'Terrain de foot', 30, ARRAY['tous'], 'FBL002')
  ON CONFLICT (code_stand) DO NOTHING;
END $$;
