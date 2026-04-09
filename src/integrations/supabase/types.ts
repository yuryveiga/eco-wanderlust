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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          content: string
          content_en: string | null
          content_es: string | null
          created_at: string
          excerpt: string | null
          excerpt_en: string | null
          excerpt_es: string | null
          id: string
          image_url: string | null
          is_published: boolean
          slug: string
          title: string
          title_en: string | null
          title_es: string | null
          updated_at: string
        }
        Insert: {
          content: string
          content_en?: string | null
          content_es?: string | null
          created_at?: string
          excerpt?: string | null
          excerpt_en?: string | null
          excerpt_es?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          slug: string
          title: string
          title_en?: string | null
          title_es?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          content_en?: string | null
          content_es?: string | null
          created_at?: string
          excerpt?: string | null
          excerpt_en?: string | null
          excerpt_es?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          slug?: string
          title?: string
          title_en?: string | null
          title_es?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: string | null
          created_at: string
          href: string
          id: string
          is_visible: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          href: string
          id?: string
          is_visible?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          href?: string
          id?: string
          is_visible?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_location: string
          author_name: string
          content: string
          content_en: string | null
          content_es: string | null
          created_at: string
          id: string
          is_published: boolean
          rating: number
          review_date: string
          sort_order: number
          title: string
          title_en: string | null
          title_es: string | null
          tour_name: string
          updated_at: string
        }
        Insert: {
          author_location?: string
          author_name: string
          content: string
          content_en?: string | null
          content_es?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          rating?: number
          review_date?: string
          sort_order?: number
          title: string
          title_en?: string | null
          title_es?: string | null
          tour_name?: string
          updated_at?: string
        }
        Update: {
          author_location?: string
          author_name?: string
          content?: string
          content_en?: string | null
          content_es?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          rating?: number
          review_date?: string
          sort_order?: number
          title?: string
          title_en?: string | null
          title_es?: string | null
          tour_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          key: string
          label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string
          key: string
          label?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          key?: string
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      social_media: {
        Row: {
          created_at: string
          icon_name: string
          id: string
          is_active: boolean
          platform: string
          show_in_header: boolean | null
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          icon_name?: string
          id?: string
          is_active?: boolean
          platform: string
          show_in_header?: boolean | null
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Update: {
          created_at?: string
          icon_name?: string
          id?: string
          is_active?: boolean
          platform?: string
          show_in_header?: boolean | null
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      tours: {
        Row: {
          allows_open: boolean
          allows_private: boolean
          category: string
          category_en: string | null
          category_es: string | null
          created_at: string
          difficulty: string | null
          difficulty_en: string | null
          difficulty_es: string | null
          duration: string
          faq_json: Json | null
          faq_json_en: Json | null
          faq_json_es: Json | null
          has_afternoon: boolean
          has_morning: boolean
          has_night: boolean
          highlights_json: Json | null
          id: string
          image_url: string
          images_json: Json | null
          included_json: Json | null
          included_json_en: Json | null
          included_json_es: Json | null
          is_active: boolean
          is_featured: boolean
          itinerary_json: Json | null
          itinerary_json_en: Json | null
          itinerary_json_es: Json | null
          max_group_size: number
          meeting_point_address: string | null
          meeting_point_address_en: string | null
          meeting_point_address_es: string | null
          price: number
          short_description: string
          short_description_en: string | null
          short_description_es: string | null
          slug: string | null
          sort_order: number
          title: string
          title_en: string | null
          title_es: string | null
          updated_at: string
          youtube_video_url: string | null
        }
        Insert: {
          allows_open?: boolean
          allows_private?: boolean
          category?: string
          category_en?: string | null
          category_es?: string | null
          created_at?: string
          difficulty?: string | null
          difficulty_en?: string | null
          difficulty_es?: string | null
          duration?: string
          faq_json?: Json | null
          faq_json_en?: Json | null
          faq_json_es?: Json | null
          has_afternoon?: boolean
          has_morning?: boolean
          has_night?: boolean
          highlights_json?: Json | null
          id?: string
          image_url?: string
          images_json?: Json | null
          included_json?: Json | null
          included_json_en?: Json | null
          included_json_es?: Json | null
          is_active?: boolean
          is_featured?: boolean
          itinerary_json?: Json | null
          itinerary_json_en?: Json | null
          itinerary_json_es?: Json | null
          max_group_size?: number
          meeting_point_address?: string | null
          meeting_point_address_en?: string | null
          meeting_point_address_es?: string | null
          price?: number
          short_description?: string
          short_description_en?: string | null
          short_description_es?: string | null
          slug?: string | null
          sort_order?: number
          title: string
          title_en?: string | null
          title_es?: string | null
          updated_at?: string
          youtube_video_url?: string | null
        }
        Update: {
          allows_open?: boolean
          allows_private?: boolean
          category?: string
          category_en?: string | null
          category_es?: string | null
          created_at?: string
          difficulty?: string | null
          difficulty_en?: string | null
          difficulty_es?: string | null
          duration?: string
          faq_json?: Json | null
          faq_json_en?: Json | null
          faq_json_es?: Json | null
          has_afternoon?: boolean
          has_morning?: boolean
          has_night?: boolean
          highlights_json?: Json | null
          id?: string
          image_url?: string
          images_json?: Json | null
          included_json?: Json | null
          included_json_en?: Json | null
          included_json_es?: Json | null
          is_active?: boolean
          is_featured?: boolean
          itinerary_json?: Json | null
          itinerary_json_en?: Json | null
          itinerary_json_es?: Json | null
          max_group_size?: number
          meeting_point_address?: string | null
          meeting_point_address_en?: string | null
          meeting_point_address_es?: string | null
          price?: number
          short_description?: string
          short_description_en?: string | null
          short_description_es?: string | null
          slug?: string | null
          sort_order?: number
          title?: string
          title_en?: string | null
          title_es?: string | null
          updated_at?: string
          youtube_video_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: number
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role:
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
        | { Args: { _role: string; _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
