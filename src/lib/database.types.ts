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
          username: string
          avatar_url: string | null
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          username?: string
          avatar_url?: string | null
        }
        Relationships: []
      }
      groups: {
        Row: {
          id: string
          name: string
          invite_code: string
          created_by: string
          created_at: string
          rules: string | null
          logo_url: string | null
          includes_group_stage: boolean
        }
        Insert: {
          id?: string
          name: string
          invite_code?: string
          created_by: string
          created_at?: string
          rules?: string | null
          logo_url?: string | null
          includes_group_stage?: boolean
        }
        Update: {
          name?: string
          rules?: string | null
          logo_url?: string | null
          includes_group_stage?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'groups_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          joined_at?: string
        }
        Update: Record<string, never>
        Relationships: [
          {
            foreignKeyName: 'group_members_group_id_fkey'
            columns: ['group_id']
            isOneToOne: false
            referencedRelation: 'groups'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'group_members_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      matches: {
        Row: {
          id: string
          home_team: string
          away_team: string
          match_date: string
          phase: string
          group_name: string | null
          home_score: number | null
          away_score: number | null
          is_finished: boolean
          venue: string | null
          penalty_winner: 'home' | 'away' | null
          created_at: string
        }
        Insert: {
          id?: string
          home_team: string
          away_team: string
          match_date: string
          phase: string
          group_name?: string | null
          home_score?: number | null
          away_score?: number | null
          is_finished?: boolean
          venue?: string | null
          penalty_winner?: 'home' | 'away' | null
          created_at?: string
        }
        Update: {
          home_team?: string
          away_team?: string
          match_date?: string
          phase?: string
          group_name?: string | null
          home_score?: number | null
          away_score?: number | null
          is_finished?: boolean
          venue?: string | null
          penalty_winner?: 'home' | 'away' | null
        }
        Relationships: []
      }
      predictions: {
        Row: {
          id: string
          user_id: string
          match_id: string
          group_id: string
          home_score: number
          away_score: number
          points: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          match_id: string
          group_id: string
          home_score: number
          away_score: number
          points?: number | null
          created_at?: string
        }
        Update: {
          home_score?: number
          away_score?: number
          points?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'predictions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'predictions_match_id_fkey'
            columns: ['match_id']
            isOneToOne: false
            referencedRelation: 'matches'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'predictions_group_id_fkey'
            columns: ['group_id']
            isOneToOne: false
            referencedRelation: 'groups'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_prediction_points: {
        Args: { p_match_id: string }
        Returns: undefined
      }
      get_leaderboard: {
        Args: { p_group_id: string }
        Returns: {
          user_id: string
          username: string
          avatar_url: string | null
          total_points: number
          exact_results: number
          correct_results: number
          total_predictions: number
        }[]
      }
      is_current_user_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_user_in_group: {
        Args: { p_group_id: string }
        Returns: boolean
      }
      join_group_by_code: {
        Args: { p_code: string }
        Returns: string
      }
    }
    Enums: {
      match_phase:
        | 'group_stage'
        | 'round_of_32'
        | 'round_of_16'
        | 'quarterfinal'
        | 'semifinal'
        | 'third_place'
        | 'final'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
