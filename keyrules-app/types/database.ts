export type UserRole = 'free' | 'starter' | 'pro' | 'elite' | 'admin'
export type PlanTier = 'starter' | 'pro' | 'elite'
export type SignalStatus = 'active' | 'executed' | 'stop' | 'tp'
export type BiasDir = 'alcista' | 'bajista' | 'neutral' | 'range'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          role: UserRole
          plan: PlanTier | null
          plan_expires_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: UserRole
          plan?: PlanTier | null
          plan_expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: UserRole
          plan?: PlanTier | null
          plan_expires_at?: string | null
        }
      }
      bias: {
        Row: {
          id: string
          pair: string
          direction: BiasDir
          session: string | null
          analysis_md: string | null
          video_url: string | null
          min_plan: PlanTier
          published_at: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          pair: string
          direction: BiasDir
          session?: string | null
          analysis_md?: string | null
          video_url?: string | null
          min_plan?: PlanTier
          published_at?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          pair?: string
          direction?: BiasDir
          session?: string | null
          analysis_md?: string | null
          video_url?: string | null
          min_plan?: PlanTier
          published_at?: string | null
        }
      }
      classes: {
        Row: {
          id: string
          title: string
          module: string | null
          duration_min: number | null
          description: string | null
          mux_playback_id: string | null
          mux_asset_id: string | null
          thumbnail_url: string | null
          min_plan: PlanTier
          published_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          module?: string | null
          duration_min?: number | null
          description?: string | null
          mux_playback_id?: string | null
          mux_asset_id?: string | null
          thumbnail_url?: string | null
          min_plan?: PlanTier
          published_at?: string | null
          created_at?: string
        }
        Update: {
          title?: string
          module?: string | null
          duration_min?: number | null
          description?: string | null
          mux_playback_id?: string | null
          mux_asset_id?: string | null
          thumbnail_url?: string | null
          min_plan?: PlanTier
          published_at?: string | null
        }
      }
      signals: {
        Row: {
          id: string
          pair: string
          direction: 'LONG' | 'SHORT'
          entry: number
          sl: number
          tp: number
          timeframe: string | null
          min_plan: PlanTier
          status: SignalStatus
          posted_at: string
        }
        Insert: {
          id?: string
          pair: string
          direction: 'LONG' | 'SHORT'
          entry: number
          sl: number
          tp: number
          timeframe?: string | null
          min_plan?: PlanTier
          status?: SignalStatus
          posted_at?: string
        }
        Update: {
          pair?: string
          direction?: 'LONG' | 'SHORT'
          entry?: number
          sl?: number
          tp?: number
          timeframe?: string | null
          min_plan?: PlanTier
          status?: SignalStatus
        }
      }
      media_items: {
        Row: {
          id: string
          kind: 'certificate' | 'review'
          storage_path: string
          caption: string | null
          published: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          kind: 'certificate' | 'review'
          storage_path: string
          caption?: string | null
          published?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          kind?: 'certificate' | 'review'
          storage_path?: string
          caption?: string | null
          published?: boolean
          sort_order?: number
        }
      }
      meet_config: {
        Row: {
          id: number
          title: string | null
          date_iso: string | null
          url: string | null
          min_plan: PlanTier
          active: boolean
          updated_at: string
        }
        Insert: {
          id?: number
          title?: string | null
          date_iso?: string | null
          url?: string | null
          min_plan?: PlanTier
          active?: boolean
          updated_at?: string
        }
        Update: {
          title?: string | null
          date_iso?: string | null
          url?: string | null
          min_plan?: PlanTier
          active?: boolean
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string | null
          plan: PlanTier | null
          amount_usd: number | null
          method: string | null
          external_id: string | null
          status: string | null
          paid_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          plan?: PlanTier | null
          amount_usd?: number | null
          method?: string | null
          external_id?: string | null
          status?: string | null
          paid_at?: string
        }
        Update: {
          user_id?: string | null
          plan?: PlanTier | null
          amount_usd?: number | null
          method?: string | null
          external_id?: string | null
          status?: string | null
        }
      }
      journal_trades: {
        Row: {
          id: string
          user_id: string
          pair: string | null
          direction: string | null
          entry: number | null
          sl: number | null
          tp: number | null
          result_pct: number | null
          notes: string | null
          taken_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pair?: string | null
          direction?: string | null
          entry?: number | null
          sl?: number | null
          tp?: number | null
          result_pct?: number | null
          notes?: string | null
          taken_at?: string
        }
        Update: {
          pair?: string | null
          direction?: string | null
          entry?: number | null
          sl?: number | null
          tp?: number | null
          result_pct?: number | null
          notes?: string | null
        }
      }
      class_progress: {
        Row: {
          user_id: string
          class_id: string
          completed_at: string | null
        }
        Insert: {
          user_id: string
          class_id: string
          completed_at?: string | null
        }
        Update: {
          completed_at?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
      plan_tier: PlanTier
      signal_status: SignalStatus
      bias_dir: BiasDir
    }
  }
}
