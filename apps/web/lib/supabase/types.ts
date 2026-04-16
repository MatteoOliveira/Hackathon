// Types TypeScript générés depuis le schéma Supabase
// Pour regénérer : npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          prenom: string;
          nom: string | null;
          tranche_age: '<18' | '18-25' | '26-40' | '41-60' | '60+' | null;
          centres_interet: string[];
          besoins_accessibilite: string[];
          langue: string;
          role: 'user' | 'admin' | 'super_admin';
          consent_notifs: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      associations: {
        Row: {
          id: string;
          nom: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          site_web: string | null;
          contact_email: string | null;
          couleur_theme: string;
          ordre_affichage: number;
          actif: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['associations']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['associations']['Insert']>;
      };
      sports: {
        Row: {
          id: string;
          nom: string;
          slug: string;
          description: string | null;
          niveau_requis: 'débutant' | 'intermédiaire' | 'confirmé' | 'tous_niveaux';
          materiel_requis: string[] | null;
          accessibilite_handicap: boolean;
          accessibilite_debutant: boolean;
          intensite: number | null;
          type_activite: string[];
          tags: string[];
          icon: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sports']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['sports']['Insert']>;
      };
      sport_associations: {
        Row: { sport_id: string; association_id: string };
        Insert: { sport_id: string; association_id: string };
        Update: Partial<{ sport_id: string; association_id: string }>;
      };
      ateliers: {
        Row: {
          id: string;
          sport_id: string | null;
          association_id: string | null;
          titre: string;
          description: string | null;
          horaire_debut: string;
          horaire_fin: string;
          lieu: string;
          capacite_max: number;
          public_cible: string[];
          code_stand: string;
          actif: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ateliers']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['ateliers']['Insert']>;
      };
      inscriptions: {
        Row: {
          id: string;
          user_id: string | null;
          email: string | null;
          prenom: string;
          tranche_age: string | null;
          centres_interet: string[];
          besoins_accessibilite: string[];
          sports_recommandes: string[];
          consent_notifs: boolean;
          source: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['inscriptions']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['inscriptions']['Insert']>;
      };
      checkins: {
        Row: {
          id: string;
          inscription_id: string;
          atelier_id: string;
          code_saisi: string;
          palier_debloque: string | null;
          horodatage: string;
        };
        Insert: Omit<Database['public']['Tables']['checkins']['Row'], 'id' | 'horodatage'> & {
          id?: string;
          horodatage?: string;
        };
        Update: Partial<Database['public']['Tables']['checkins']['Insert']>;
      };
      messages_contact: {
        Row: {
          id: string;
          nom: string;
          email: string;
          sujet: string | null;
          message: string;
          traite: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages_contact']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['messages_contact']['Insert']>;
      };
      config: {
        Row: { key: string; value: Json; updated_at: string };
        Insert: { key: string; value: Json; updated_at?: string };
        Update: Partial<Database['public']['Tables']['config']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
