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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_alerts: {
        Row: {
          admin_id: string
          category: string
          content: string | null
          created_at: string
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          link_url: string | null
          subcategory: string | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_id: string
          category?: string
          content?: string | null
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          link_url?: string | null
          subcategory?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_id?: string
          category?: string
          content?: string | null
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          link_url?: string | null
          subcategory?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      alert_read_status: {
        Row: {
          alert_id: string
          created_at: string
          id: string
          is_read: boolean
          user_id: string
        }
        Insert: {
          alert_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          user_id: string
        }
        Update: {
          alert_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_read_status_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "admin_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogue_products: {
        Row: {
          admin_id: string
          asin: string | null
          created_at: string
          description: string | null
          ean: string | null
          id: string
          images: string[] | null
          price: number
          price_type: string
          quantity: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          admin_id: string
          asin?: string | null
          created_at?: string
          description?: string | null
          ean?: string | null
          id?: string
          images?: string[] | null
          price: number
          price_type?: string
          quantity?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          admin_id?: string
          asin?: string | null
          created_at?: string
          description?: string | null
          ean?: string | null
          id?: string
          images?: string[] | null
          price?: number
          price_type?: string
          quantity?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string | null
          created_at: string
          file_name: string | null
          file_url: string | null
          id: string
          mentions: string[] | null
          message_type: string
          reply_to: string | null
          room_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          mentions?: string[] | null
          message_type?: string
          reply_to?: string | null
          room_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          mentions?: string[] | null
          message_type?: string
          reply_to?: string | null
          room_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_room_members: {
        Row: {
          id: string
          joined_at: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_room_pins: {
        Row: {
          id: string
          pinned_at: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          pinned_at?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          pinned_at?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_pins_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_room_visibility: {
        Row: {
          created_at: string
          id: string
          is_hidden: boolean
          room_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_hidden?: boolean
          room_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_hidden?: boolean
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_visibility_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          name: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      direct_conversation_visibility: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          is_hidden: boolean
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_conversation_visibility_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "direct_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_conversations: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          sender_id: string
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          sender_id: string
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "direct_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_buy_requests: {
        Row: {
          asin: string | null
          created_at: string
          description: string | null
          ean: string | null
          id: string
          images: string[] | null
          max_price: number | null
          price_type: string
          quantity: number
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          asin?: string | null
          created_at?: string
          description?: string | null
          ean?: string | null
          id?: string
          images?: string[] | null
          max_price?: number | null
          price_type?: string
          quantity?: number
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          asin?: string | null
          created_at?: string
          description?: string | null
          ean?: string | null
          id?: string
          images?: string[] | null
          max_price?: number | null
          price_type?: string
          quantity?: number
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          asin: string | null
          created_at: string
          description: string | null
          ean: string | null
          id: string
          images: string[] | null
          price: number
          price_type: string
          quantity: number
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          asin?: string | null
          created_at?: string
          description?: string | null
          ean?: string | null
          id?: string
          images?: string[] | null
          price: number
          price_type?: string
          quantity?: number
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          asin?: string | null
          created_at?: string
          description?: string | null
          ean?: string | null
          id?: string
          images?: string[] | null
          price?: number
          price_type?: string
          quantity?: number
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      message_read_status: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_read_status_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          created_at: string
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          ticket_id: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          category: string
          created_at: string
          enabled: boolean
          id: string
          subcategory: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          enabled?: boolean
          id?: string
          subcategory?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          enabled?: boolean
          id?: string
          subcategory?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          nickname: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          nickname?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          nickname?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_trial: boolean | null
          plan_type: string
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_trial?: boolean | null
          plan_type: string
          started_at?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_trial?: boolean | null
          plan_type?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          category: string | null
          closed_at: string | null
          created_at: string
          id: string
          priority: string
          status: string
          subcategory: string | null
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          closed_at?: string | null
          created_at?: string
          id?: string
          priority?: string
          status?: string
          subcategory?: string | null
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          closed_at?: string | null
          created_at?: string
          id?: string
          priority?: string
          status?: string
          subcategory?: string | null
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verification_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          new_value: string | null
          type: string
          used: boolean
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string
          id?: string
          new_value?: string | null
          type: string
          used?: boolean
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          new_value?: string | null
          type?: string
          used?: boolean
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_expire_subscriptions: { Args: never; Returns: undefined }
      get_admin_user_id: { Args: never; Returns: string }
      get_or_create_conversation: {
        Args: { other_user_id: string }
        Returns: string
      }
      get_public_profile: {
        Args: { user_id_param: string }
        Returns: {
          avatar_url: string
          full_name: string
          id: string
          nickname: string
        }[]
      }
      get_unread_alerts_count: {
        Args: {
          category_param: string
          subcategory_param?: string
          user_id_param: string
        }
        Returns: number
      }
      get_unread_count: {
        Args: { ticket_id_param: string; user_id_param: string }
        Returns: number
      }
      has_open_ticket: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_marketplace_room: { Args: { _room_id: string }; Returns: boolean }
      is_marketplace_room_creator: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
      is_room_member: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
      is_vip_user: { Args: { _user_id: string }; Returns: boolean }
      mark_alerts_as_read: {
        Args: { category_param: string; subcategory_param?: string }
        Returns: undefined
      }
      mark_ticket_messages_as_read: {
        Args: { ticket_id_param: string }
        Returns: undefined
      }
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
