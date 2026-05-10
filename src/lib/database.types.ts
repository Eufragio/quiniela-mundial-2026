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
      }
      groups: {
        Row: {
          id: string
          name: string
          invite_code: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          invite_code?: string
          created_by: string
          created_at?: string
        }
        Update: {
          name?: string
        }
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
        }
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
      }
    }
    Functions: {
      calculate_prediction_points: {
        Args: { p_match_id: string }
        Returns: void
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
    }
  }
}
