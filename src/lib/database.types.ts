export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      emotion_entries: {
        Row: {
          id: string
          user_id: string
          mood_score: number
          emotion_tags: string[]
          situation: string | null
          body: string
          entry_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          mood_score: number
          emotion_tags?: string[]
          situation?: string | null
          body: string
          entry_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          mood_score?: number
          emotion_tags?: string[]
          situation?: string | null
          body?: string
          entry_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotion_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      gratitude_notes: {
        Row: {
          id: string
          user_id: string
          items: string[]
          note: string | null
          note_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          items: string[]
          note?: string | null
          note_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          items?: string[]
          note?: string | null
          note_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gratitude_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      motivation_cards: {
        Row: {
          id: string
          user_id: string
          text: string
          tags: string[]
          theme: "sage" | "rose" | "amber" | "sky"
          is_favorite: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          text: string
          tags?: string[]
          theme?: "sage" | "rose" | "amber" | "sky"
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          text?: string
          tags?: string[]
          theme?: "sage" | "rose" | "amber" | "sky"
          is_favorite?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "motivation_cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
