export type Phase =
  | 'group_stage'
  | 'round_of_32'
  | 'round_of_16'
  | 'quarterfinal'
  | 'semifinal'
  | 'third_place'
  | 'final'

export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  is_admin: boolean
  created_at: string
}

export interface Group {
  id: string
  name: string
  invite_code: string
  created_by: string
  created_at: string
  rules: string | null
  logo_url: string | null
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  joined_at: string
  profile?: Profile
}

export interface GroupWithMeta extends Group {
  member_count?: number
  is_admin?: boolean
}

export interface Match {
  id: string
  home_team: string
  away_team: string
  match_date: string
  phase: Phase
  group_name: string | null
  home_score: number | null
  away_score: number | null
  is_finished: boolean
  venue: string | null
}

export interface Prediction {
  id: string
  user_id: string
  match_id: string
  group_id: string
  home_score: number
  away_score: number
  points: number | null
  created_at: string
}

export interface PredictionWithMatch extends Prediction {
  match?: Match
}

export interface LeaderboardEntry {
  user_id: string
  username: string
  avatar_url: string | null
  total_points: number
  exact_results: number
  correct_results: number
  total_predictions: number
  rank?: number
}

export type AuthView = 'login' | 'register' | 'forgot'
