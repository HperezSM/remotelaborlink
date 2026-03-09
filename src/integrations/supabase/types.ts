export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      candidate_certifications: {
        Row: {
          candidate_id: string
          file_name: string
          file_type: string
          file_url: string
          id: string
          uploaded_at: string
        }
        Insert: {
          candidate_id: string
          file_name: string
          file_type?: string
          file_url: string
          id?: string
          uploaded_at?: string
        }
        Update: {
          candidate_id?: string
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_certifications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_photos: {
        Row: {
          candidate_id: string
          created_at: string
          display_order: number | null
          id: string
          photo_url: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          display_order?: number | null
          id?: string
          photo_url: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          display_order?: number | null
          id?: string
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_photos_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_portfolio_links: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          label: string | null
          link_type: string
          url: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          label?: string | null
          link_type?: string
          url: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          label?: string | null
          link_type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_portfolio_links_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_profiles: {
        Row: {
          availability: string | null
          bio: string | null
          city: string
          country: string
          created_at: string
          employment_status: string | null
          english_proficiency: string | null
          expected_rate_usd: number | null
          field_of_study: string | null
          first_name: string | null
          full_name: string
          github_url: string | null
          id: string
          industries: string[] | null
          last_name: string | null
          linkedin_url: string | null
          loom_video_url: string | null
          onboarding_completed: boolean
          phone: string | null
          portfolio_link: string | null
          portfolio_url: string | null
          profile_photo_url: string | null
          proud_achievement: string | null
          resume_url: string | null
          roles_applied: string[]
          seniority_level: string | null
          status: string
          technical_skills: string[] | null
          updated_at: string
          us_hours_available: string | null
          user_id: string
          work_type_preference: string | null
          years_experience: string | null
        }
        Insert: {
          availability?: string | null
          bio?: string | null
          city: string
          country: string
          created_at?: string
          employment_status?: string | null
          english_proficiency?: string | null
          expected_rate_usd?: number | null
          field_of_study?: string | null
          first_name?: string | null
          full_name: string
          github_url?: string | null
          id?: string
          industries?: string[] | null
          last_name?: string | null
          linkedin_url?: string | null
          loom_video_url?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          portfolio_link?: string | null
          portfolio_url?: string | null
          profile_photo_url?: string | null
          proud_achievement?: string | null
          resume_url?: string | null
          roles_applied?: string[]
          seniority_level?: string | null
          status?: string
          technical_skills?: string[] | null
          updated_at?: string
          us_hours_available?: string | null
          user_id: string
          work_type_preference?: string | null
          years_experience?: string | null
        }
        Update: {
          availability?: string | null
          bio?: string | null
          city?: string
          country?: string
          created_at?: string
          employment_status?: string | null
          english_proficiency?: string | null
          expected_rate_usd?: number | null
          field_of_study?: string | null
          first_name?: string | null
          full_name?: string
          github_url?: string | null
          id?: string
          industries?: string[] | null
          last_name?: string | null
          linkedin_url?: string | null
          loom_video_url?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          portfolio_link?: string | null
          portfolio_url?: string | null
          profile_photo_url?: string | null
          proud_achievement?: string | null
          resume_url?: string | null
          roles_applied?: string[]
          seniority_level?: string | null
          status?: string
          technical_skills?: string[] | null
          updated_at?: string
          us_hours_available?: string | null
          user_id?: string
          work_type_preference?: string | null
          years_experience?: string | null
        }
        Relationships: []
      }
      candidate_pushes: {
        Row: {
          admin_note: string | null
          candidate_id: string
          company_action: string
          company_id: string
          id: string
          pushed_at: string
          role_request_id: string | null
        }
        Insert: {
          admin_note?: string | null
          candidate_id: string
          company_action?: string
          company_id: string
          id?: string
          pushed_at?: string
          role_request_id?: string | null
        }
        Update: {
          admin_note?: string | null
          candidate_id?: string
          company_action?: string
          company_id?: string
          id?: string
          pushed_at?: string
          role_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_pushes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_pushes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_pushes_role_request_id_fkey"
            columns: ["role_request_id"]
            isOneToOne: false
            referencedRelation: "role_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          company_email: string
          company_name: string
          company_size: string | null
          company_website: string | null
          contact_person_name: string | null
          created_at: string
          how_heard: string | null
          id: string
          industry: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_email: string
          company_name: string
          company_size?: string | null
          company_website?: string | null
          contact_person_name?: string | null
          created_at?: string
          how_heard?: string | null
          id?: string
          industry?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_email?: string
          company_name?: string
          company_size?: string | null
          company_website?: string | null
          contact_person_name?: string | null
          created_at?: string
          how_heard?: string | null
          id?: string
          industry?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      company_message_usage: {
        Row: {
          billing_period_start: string
          company_id: string
          id: string
          messages_sent: number
          updated_at: string
        }
        Insert: {
          billing_period_start?: string
          company_id: string
          id?: string
          messages_sent?: number
          updated_at?: string
        }
        Update: {
          billing_period_start?: string
          company_id?: string
          id?: string
          messages_sent?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_message_usage_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          enabled: boolean
          flag_key: string
          flag_label: string
          id: string
          updated_at: string
        }
        Insert: {
          enabled?: boolean
          flag_key: string
          flag_label: string
          id?: string
          updated_at?: string
        }
        Update: {
          enabled?: boolean
          flag_key?: string
          flag_label?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      interviews: {
        Row: {
          candidate_id: string
          candidate_push_id: string
          company_id: string
          created_at: string
          duration_minutes: number
          id: string
          meeting_link: string | null
          notes: string | null
          scheduled_at: string
          status: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          candidate_push_id: string
          company_id: string
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          candidate_push_id?: string
          company_id?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_candidate_push_id_fkey"
            columns: ["candidate_push_id"]
            isOneToOne: false
            referencedRelation: "candidate_pushes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          admin_notes: string | null
          applied_at: string
          candidate_id: string
          id: string
          job_id: string
          status: string
        }
        Insert: {
          admin_notes?: string | null
          applied_at?: string
          candidate_id: string
          id?: string
          job_id: string
          status?: string
        }
        Update: {
          admin_notes?: string | null
          applied_at?: string
          candidate_id?: string
          id?: string
          job_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company_id: string | null
          created_at: string
          created_by_admin: string | null
          engagement_type: string | null
          full_description: string | null
          id: string
          nice_to_haves: string | null
          posted_at: string
          requirements: string | null
          role_type: string
          salary_max: number | null
          salary_min: number | null
          seniority: string | null
          short_description: string | null
          show_company_name: boolean
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by_admin?: string | null
          engagement_type?: string | null
          full_description?: string | null
          id?: string
          nice_to_haves?: string | null
          posted_at?: string
          requirements?: string | null
          role_type: string
          salary_max?: number | null
          salary_min?: number | null
          seniority?: string | null
          short_description?: string | null
          show_company_name?: boolean
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by_admin?: string | null
          engagement_type?: string | null
          full_description?: string | null
          id?: string
          nice_to_haves?: string | null
          posted_at?: string
          requirements?: string | null
          role_type?: string
          salary_max?: number | null
          salary_min?: number | null
          seniority?: string | null
          short_description?: string | null
          show_company_name?: boolean
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          recipient_id: string
          recipient_role: Database["public"]["Enums"]["app_role"]
          sender_id: string
          sender_role: Database["public"]["Enums"]["app_role"]
          thread_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id: string
          recipient_role: Database["public"]["Enums"]["app_role"]
          sender_id: string
          sender_role: Database["public"]["Enums"]["app_role"]
          thread_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id?: string
          recipient_role?: Database["public"]["Enums"]["app_role"]
          sender_id?: string
          sender_role?: Database["public"]["Enums"]["app_role"]
          thread_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          company_name: string
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          logo_url: string
          website_url: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url: string
          website_url?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string
          website_url?: string | null
        }
        Relationships: []
      }
      profile_views: {
        Row: {
          candidate_id: string
          company_id: string
          id: string
          viewed_at: string
        }
        Insert: {
          candidate_id: string
          company_id: string
          id?: string
          viewed_at?: string
        }
        Update: {
          candidate_id?: string
          company_id?: string
          id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_views_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_views_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      role_requests: {
        Row: {
          additional_notes: string | null
          admin_notes: string | null
          budget_max: number | null
          budget_min: number | null
          company_id: string
          created_at: string
          engagement_type: string | null
          id: string
          must_have_skills: string[] | null
          nice_to_have_skills: string[] | null
          num_hires: number | null
          responsibilities: string | null
          role_title: string
          role_type: string
          seniority: string
          start_timeline: string | null
          status: string
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          admin_notes?: string | null
          budget_max?: number | null
          budget_min?: number | null
          company_id: string
          created_at?: string
          engagement_type?: string | null
          id?: string
          must_have_skills?: string[] | null
          nice_to_have_skills?: string[] | null
          num_hires?: number | null
          responsibilities?: string | null
          role_title: string
          role_type: string
          seniority: string
          start_timeline?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          admin_notes?: string | null
          budget_max?: number | null
          budget_min?: number | null
          company_id?: string
          created_at?: string
          engagement_type?: string | null
          id?: string
          must_have_skills?: string[] | null
          nice_to_have_skills?: string[] | null
          num_hires?: number | null
          responsibilities?: string | null
          role_title?: string
          role_type?: string
          seniority?: string
          start_timeline?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          bullets: string[] | null
          created_at: string
          display_order: number | null
          id: string
          initials: string
          name: string
          photo_url: string | null
          quote: string | null
          role: string
          updated_at: string
        }
        Insert: {
          bullets?: string[] | null
          created_at?: string
          display_order?: number | null
          id?: string
          initials: string
          name: string
          photo_url?: string | null
          quote?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          bullets?: string[] | null
          created_at?: string
          display_order?: number | null
          id?: string
          initials?: string
          name?: string
          photo_url?: string | null
          quote?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_name: string
          client_role: string | null
          company_name: string | null
          content: string
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          photo_url: string | null
          rating: number | null
        }
        Insert: {
          client_name: string
          client_role?: string | null
          company_name?: string | null
          content: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          photo_url?: string | null
          rating?: number | null
        }
        Update: {
          client_name?: string
          client_role?: string | null
          company_name?: string | null
          content?: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          photo_url?: string | null
          rating?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "candidate" | "company" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["candidate", "company", "admin"],
    },
  },
} as const
