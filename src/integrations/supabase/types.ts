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
      admin_deletion_logs: {
        Row: {
          admin_email: string
          admin_id: string
          created_at: string
          deleted_user_email: string
          deleted_user_id: string
          deleted_user_name: string | null
          deleted_user_phone: string | null
          deleted_user_plan: string | null
          deleted_user_stripe_customer_id: string | null
          id: string
          reason: string | null
        }
        Insert: {
          admin_email: string
          admin_id: string
          created_at?: string
          deleted_user_email: string
          deleted_user_id: string
          deleted_user_name?: string | null
          deleted_user_phone?: string | null
          deleted_user_plan?: string | null
          deleted_user_stripe_customer_id?: string | null
          id?: string
          reason?: string | null
        }
        Update: {
          admin_email?: string
          admin_id?: string
          created_at?: string
          deleted_user_email?: string
          deleted_user_id?: string
          deleted_user_name?: string | null
          deleted_user_phone?: string | null
          deleted_user_plan?: string | null
          deleted_user_stripe_customer_id?: string | null
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      admin_impersonation_tokens: {
        Row: {
          admin_id: string
          created_at: string
          expires_at: string
          id: string
          target_user_id: string
          token: string
          used_at: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string
          expires_at: string
          id?: string
          target_user_id: string
          token: string
          used_at?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          target_user_id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      affiliate_clicks: {
        Row: {
          clicked_at: string
          id: string
          referrer_user_id: string
          source_ip: string | null
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string
          id?: string
          referrer_user_id: string
          source_ip?: string | null
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string
          id?: string
          referrer_user_id?: string
          source_ip?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_referrer_user_id_fkey"
            columns: ["referrer_user_id"]
            isOneToOne: false
            referencedRelation: "affiliate_users"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_referrals: {
        Row: {
          created_at: string
          id: string
          payment_date: string | null
          payment_month: string | null
          payment_status: string
          referred_email: string
          referred_user_id: string | null
          referrer_user_id: string
          signup_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          payment_date?: string | null
          payment_month?: string | null
          payment_status?: string
          referred_email: string
          referred_user_id?: string | null
          referrer_user_id: string
          signup_date?: string
        }
        Update: {
          created_at?: string
          id?: string
          payment_date?: string | null
          payment_month?: string | null
          payment_status?: string
          referred_email?: string
          referred_user_id?: string | null
          referrer_user_id?: string
          signup_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_referrals_referrer_user_id_fkey"
            columns: ["referrer_user_id"]
            isOneToOne: false
            referencedRelation: "affiliate_users"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_users: {
        Row: {
          bic: string
          billing_address: string
          company_name: string | null
          company_type: string
          created_at: string
          email: string
          email_verified: boolean
          first_name: string
          iban: string
          id: string
          last_name: string
          password_hash: string
          phone: string
          referral_code: string
          siret: string | null
          updated_at: string
          verification_code: string | null
        }
        Insert: {
          bic: string
          billing_address: string
          company_name?: string | null
          company_type: string
          created_at?: string
          email: string
          email_verified?: boolean
          first_name: string
          iban: string
          id?: string
          last_name: string
          password_hash: string
          phone: string
          referral_code: string
          siret?: string | null
          updated_at?: string
          verification_code?: string | null
        }
        Update: {
          bic?: string
          billing_address?: string
          company_name?: string | null
          company_type?: string
          created_at?: string
          email?: string
          email_verified?: boolean
          first_name?: string
          iban?: string
          id?: string
          last_name?: string
          password_hash?: string
          phone?: string
          referral_code?: string
          siret?: string | null
          updated_at?: string
          verification_code?: string | null
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
      analysis_filter_presets: {
        Row: {
          created_at: string | null
          filters: Json
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filters?: Json
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          filters?: Json
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      analysis_results: {
        Row: {
          alerts: string | null
          amazon_url: string | null
          analysis_id: string
          asin: string | null
          bsr: number | null
          buy_price: number | null
          category: string | null
          commission_pct: number | null
          country_code: string | null
          created_at: string | null
          ean: string | null
          fba_fee: number | null
          fba_sellers: number | null
          fbm_sellers: number | null
          id: string
          product_name: string | null
          profit_fba: number | null
          profit_fbm: number | null
          roi_fba: number | null
          roi_fbm: number | null
          sales_monthly: number | null
          sell_price: number | null
          variations: number | null
        }
        Insert: {
          alerts?: string | null
          amazon_url?: string | null
          analysis_id: string
          asin?: string | null
          bsr?: number | null
          buy_price?: number | null
          category?: string | null
          commission_pct?: number | null
          country_code?: string | null
          created_at?: string | null
          ean?: string | null
          fba_fee?: number | null
          fba_sellers?: number | null
          fbm_sellers?: number | null
          id?: string
          product_name?: string | null
          profit_fba?: number | null
          profit_fbm?: number | null
          roi_fba?: number | null
          roi_fbm?: number | null
          sales_monthly?: number | null
          sell_price?: number | null
          variations?: number | null
        }
        Update: {
          alerts?: string | null
          amazon_url?: string | null
          analysis_id?: string
          asin?: string | null
          bsr?: number | null
          buy_price?: number | null
          category?: string | null
          commission_pct?: number | null
          country_code?: string | null
          created_at?: string | null
          ean?: string | null
          fba_fee?: number | null
          fba_sellers?: number | null
          fbm_sellers?: number | null
          id?: string
          product_name?: string | null
          profit_fba?: number | null
          profit_fbm?: number | null
          roi_fba?: number | null
          roi_fbm?: number | null
          sales_monthly?: number | null
          sell_price?: number | null
          variations?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "file_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      android_test_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          page: string | null
          prenom: string | null
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          page?: string | null
          prenom?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          page?: string | null
          prenom?: string | null
          source?: string | null
        }
        Relationships: []
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
      eany_catalogue: {
        Row: {
          brand: string
          created_at: string
          ean: string
          id: string
          price_ht: number
          updated_at: string
        }
        Insert: {
          brand?: string
          created_at?: string
          ean: string
          id?: string
          price_ht: number
          updated_at?: string
        }
        Update: {
          brand?: string
          created_at?: string
          ean?: string
          id?: string
          price_ht?: number
          updated_at?: string
        }
        Relationships: []
      }
      eany_products: {
        Row: {
          alerts: string[] | null
          amazon_url: string | null
          created_at: string | null
          ean: string
          fba_profit: number | null
          fba_roi: number | null
          fbm_profit: number | null
          fbm_roi: number | null
          id: string
          qogita_price_ht: number | null
          qogita_price_ttc: number | null
          qogita_stock: number | null
          qogita_url: string | null
          selleramp_bsr: string | null
          selleramp_sale_price: number | null
          selleramp_sales: string | null
          selleramp_sellers: string | null
          selleramp_url: string | null
          selleramp_variations: string | null
          timestamp: string
          updated_at: string | null
        }
        Insert: {
          alerts?: string[] | null
          amazon_url?: string | null
          created_at?: string | null
          ean: string
          fba_profit?: number | null
          fba_roi?: number | null
          fbm_profit?: number | null
          fbm_roi?: number | null
          id?: string
          qogita_price_ht?: number | null
          qogita_price_ttc?: number | null
          qogita_stock?: number | null
          qogita_url?: string | null
          selleramp_bsr?: string | null
          selleramp_sale_price?: number | null
          selleramp_sales?: string | null
          selleramp_sellers?: string | null
          selleramp_url?: string | null
          selleramp_variations?: string | null
          timestamp: string
          updated_at?: string | null
        }
        Update: {
          alerts?: string[] | null
          amazon_url?: string | null
          created_at?: string | null
          ean?: string
          fba_profit?: number | null
          fba_roi?: number | null
          fbm_profit?: number | null
          fbm_roi?: number | null
          id?: string
          qogita_price_ht?: number | null
          qogita_price_ttc?: number | null
          qogita_stock?: number | null
          qogita_url?: string | null
          selleramp_bsr?: string | null
          selleramp_sale_price?: number | null
          selleramp_sales?: string | null
          selleramp_sellers?: string | null
          selleramp_url?: string | null
          selleramp_variations?: string | null
          timestamp?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      failed_payments: {
        Row: {
          amount: number
          attempt_count: number
          created_at: string
          currency: string
          email: string
          email_sent: boolean
          email_sent_at: string | null
          failure_reason: string | null
          full_name: string | null
          id: string
          notes: string | null
          phone: string | null
          resolved: boolean
          resolved_at: string | null
          rubypayeur_ref: string | null
          rubypayeur_status: string | null
          rubypayeur_submitted: boolean
          rubypayeur_submitted_at: string | null
          stripe_customer_id: string | null
          stripe_invoice_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          attempt_count?: number
          created_at?: string
          currency?: string
          email: string
          email_sent?: boolean
          email_sent_at?: string | null
          failure_reason?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          resolved?: boolean
          resolved_at?: string | null
          rubypayeur_ref?: string | null
          rubypayeur_status?: string | null
          rubypayeur_submitted?: boolean
          rubypayeur_submitted_at?: string | null
          stripe_customer_id?: string | null
          stripe_invoice_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          attempt_count?: number
          created_at?: string
          currency?: string
          email?: string
          email_sent?: boolean
          email_sent_at?: string | null
          failure_reason?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          resolved?: boolean
          resolved_at?: string | null
          rubypayeur_ref?: string | null
          rubypayeur_status?: string | null
          rubypayeur_submitted?: boolean
          rubypayeur_submitted_at?: string | null
          stripe_customer_id?: string | null
          stripe_invoice_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      file_analyses: {
        Row: {
          column_mapping: Json | null
          created_at: string | null
          error_message: string | null
          file_name: string
          file_path: string
          filters: Json
          id: string
          processing_duration_ms: number | null
          results_count: number | null
          status: string
          total_rows: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          column_mapping?: Json | null
          created_at?: string | null
          error_message?: string | null
          file_name: string
          file_path: string
          filters?: Json
          id?: string
          processing_duration_ms?: number | null
          results_count?: number | null
          status?: string
          total_rows?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          column_mapping?: Json | null
          created_at?: string | null
          error_message?: string | null
          file_name?: string
          file_path?: string
          filters?: Json
          id?: string
          processing_duration_ms?: number | null
          results_count?: number | null
          status?: string
          total_rows?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      mp_favorites: {
        Row: {
          asin: string
          country_code: string
          created_at: string
          id: string
          image_url: string | null
          notes: string | null
          product_name: string | null
          user_id: string
        }
        Insert: {
          asin: string
          country_code?: string
          created_at?: string
          id?: string
          image_url?: string | null
          notes?: string | null
          product_name?: string | null
          user_id: string
        }
        Update: {
          asin?: string
          country_code?: string
          created_at?: string
          id?: string
          image_url?: string | null
          notes?: string | null
          product_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mp_lookup_results: {
        Row: {
          alerts: string | null
          amazon_price: number | null
          amazon_url: string | null
          asin: string
          bsr: number | null
          buy_price: number | null
          category: string | null
          closing_fee: number | null
          commission_eur: number | null
          commission_pct: number | null
          country_code: string
          created_at: string
          dst_fee: number | null
          ean: string | null
          eu_data: Json | null
          fba_fee: number | null
          fba_price: number | null
          fba_sellers: number | null
          fbm_sellers: number | null
          height_mm: number | null
          id: string
          image_url: string | null
          keepa_data: Json | null
          length_mm: number | null
          lookup_id: string
          offers: Json | null
          product_name: string | null
          profit_fba: number | null
          profit_fbm: number | null
          roi_fba: number | null
          roi_fbm: number | null
          sales_monthly: number | null
          sell_price: number | null
          total_fees_fba: number | null
          total_fees_fbm: number | null
          user_id: string
          variations: number | null
          weight_g: number | null
          width_mm: number | null
        }
        Insert: {
          alerts?: string | null
          amazon_price?: number | null
          amazon_url?: string | null
          asin: string
          bsr?: number | null
          buy_price?: number | null
          category?: string | null
          closing_fee?: number | null
          commission_eur?: number | null
          commission_pct?: number | null
          country_code: string
          created_at?: string
          dst_fee?: number | null
          ean?: string | null
          eu_data?: Json | null
          fba_fee?: number | null
          fba_price?: number | null
          fba_sellers?: number | null
          fbm_sellers?: number | null
          height_mm?: number | null
          id?: string
          image_url?: string | null
          keepa_data?: Json | null
          length_mm?: number | null
          lookup_id: string
          offers?: Json | null
          product_name?: string | null
          profit_fba?: number | null
          profit_fbm?: number | null
          roi_fba?: number | null
          roi_fbm?: number | null
          sales_monthly?: number | null
          sell_price?: number | null
          total_fees_fba?: number | null
          total_fees_fbm?: number | null
          user_id: string
          variations?: number | null
          weight_g?: number | null
          width_mm?: number | null
        }
        Update: {
          alerts?: string | null
          amazon_price?: number | null
          amazon_url?: string | null
          asin?: string
          bsr?: number | null
          buy_price?: number | null
          category?: string | null
          closing_fee?: number | null
          commission_eur?: number | null
          commission_pct?: number | null
          country_code?: string
          created_at?: string
          dst_fee?: number | null
          ean?: string | null
          eu_data?: Json | null
          fba_fee?: number | null
          fba_price?: number | null
          fba_sellers?: number | null
          fbm_sellers?: number | null
          height_mm?: number | null
          id?: string
          image_url?: string | null
          keepa_data?: Json | null
          length_mm?: number | null
          lookup_id?: string
          offers?: Json | null
          product_name?: string | null
          profit_fba?: number | null
          profit_fbm?: number | null
          roi_fba?: number | null
          roi_fbm?: number | null
          sales_monthly?: number | null
          sell_price?: number | null
          total_fees_fba?: number | null
          total_fees_fbm?: number | null
          user_id?: string
          variations?: number | null
          weight_g?: number | null
          width_mm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mp_lookup_results_lookup_id_fkey"
            columns: ["lookup_id"]
            isOneToOne: false
            referencedRelation: "mp_lookups"
            referencedColumns: ["id"]
          },
        ]
      }
      mp_lookups: {
        Row: {
          country_code: string
          created_at: string
          error_message: string | null
          id: string
          processing_ms: number | null
          profile_id: string | null
          query_input: string
          query_type: string
          results_count: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          country_code?: string
          created_at?: string
          error_message?: string | null
          id?: string
          processing_ms?: number | null
          profile_id?: string | null
          query_input: string
          query_type?: string
          results_count?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          country_code?: string
          created_at?: string
          error_message?: string | null
          id?: string
          processing_ms?: number | null
          profile_id?: string | null
          query_input?: string
          query_type?: string
          results_count?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mp_lookups_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "mp_settings_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mp_product_cache: {
        Row: {
          asin: string
          country_code: string
          fetched_at: string
          id: string
          raw_data: Json
        }
        Insert: {
          asin: string
          country_code: string
          fetched_at?: string
          id?: string
          raw_data: Json
        }
        Update: {
          asin?: string
          country_code?: string
          fetched_at?: string
          id?: string
          raw_data?: Json
        }
        Relationships: []
      }
      mp_settings_profiles: {
        Row: {
          country_code: string
          created_at: string
          custom_margin: number
          id: string
          inbound_cost: number
          is_default: boolean
          name: string
          prep_cost: number
          updated_at: string
          user_id: string
          vat_rate: number
        }
        Insert: {
          country_code?: string
          created_at?: string
          custom_margin?: number
          id?: string
          inbound_cost?: number
          is_default?: boolean
          name?: string
          prep_cost?: number
          updated_at?: string
          user_id: string
          vat_rate?: number
        }
        Update: {
          country_code?: string
          created_at?: string
          custom_margin?: number
          id?: string
          inbound_cost?: number
          is_default?: boolean
          name?: string
          prep_cost?: number
          updated_at?: string
          user_id?: string
          vat_rate?: number
        }
        Relationships: []
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
      product_find_alerts: {
        Row: {
          admin_id: string
          amazon_url: string | null
          bsr: string | null
          bsr_percent: string | null
          cost_price: number | null
          created_at: string
          current_price: number
          ean: string
          fba_profit: number | null
          fba_roi: number | null
          fulfillment_type: string | null
          id: string
          meltable: string | null
          monthly_sales: string | null
          original_price: number | null
          private_label: string | null
          product_size: string | null
          product_title: string
          profit: number | null
          raw_message: string | null
          roi: number | null
          sale_price: number | null
          sas_url: string | null
          sellers: string | null
          source_name: string
          source_url: string | null
          updated_at: string
          variations: string | null
        }
        Insert: {
          admin_id: string
          amazon_url?: string | null
          bsr?: string | null
          bsr_percent?: string | null
          cost_price?: number | null
          created_at?: string
          current_price: number
          ean: string
          fba_profit?: number | null
          fba_roi?: number | null
          fulfillment_type?: string | null
          id?: string
          meltable?: string | null
          monthly_sales?: string | null
          original_price?: number | null
          private_label?: string | null
          product_size?: string | null
          product_title: string
          profit?: number | null
          raw_message?: string | null
          roi?: number | null
          sale_price?: number | null
          sas_url?: string | null
          sellers?: string | null
          source_name: string
          source_url?: string | null
          updated_at?: string
          variations?: string | null
        }
        Update: {
          admin_id?: string
          amazon_url?: string | null
          bsr?: string | null
          bsr_percent?: string | null
          cost_price?: number | null
          created_at?: string
          current_price?: number
          ean?: string
          fba_profit?: number | null
          fba_roi?: number | null
          fulfillment_type?: string | null
          id?: string
          meltable?: string | null
          monthly_sales?: string | null
          original_price?: number | null
          private_label?: string | null
          product_size?: string | null
          product_title?: string
          profit?: number | null
          raw_message?: string | null
          roi?: number | null
          sale_price?: number | null
          sas_url?: string | null
          sellers?: string | null
          source_name?: string
          source_url?: string | null
          updated_at?: string
          variations?: string | null
        }
        Relationships: []
      }
      product_find_read_status: {
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
            foreignKeyName: "product_find_read_status_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "product_find_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      product_searches: {
        Row: {
          cache_hit: boolean | null
          created_at: string | null
          error_message: string | null
          expires_at: string | null
          filters: Json
          filters_hash: string
          id: string
          name: string
          processing_duration_ms: number | null
          provider: string
          results_count: number | null
          results_summary: Json | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cache_hit?: boolean | null
          created_at?: string | null
          error_message?: string | null
          expires_at?: string | null
          filters?: Json
          filters_hash: string
          id?: string
          name: string
          processing_duration_ms?: number | null
          provider?: string
          results_count?: number | null
          results_summary?: Json | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cache_hit?: boolean | null
          created_at?: string | null
          error_message?: string | null
          expires_at?: string | null
          filters?: Json
          filters_hash?: string
          id?: string
          name?: string
          processing_duration_ms?: number | null
          provider?: string
          results_count?: number | null
          results_summary?: Json | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          nickname: string | null
          phone: string | null
          registration_source: string | null
          siren: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          nickname?: string | null
          phone?: string | null
          registration_source?: string | null
          siren?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          nickname?: string | null
          phone?: string | null
          registration_source?: string | null
          siren?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      push_notification_history: {
        Row: {
          alert_id: string
          id: string
          platform: string | null
          sent_at: string | null
          user_id: string
        }
        Insert: {
          alert_id: string
          id?: string
          platform?: string | null
          sent_at?: string | null
          user_id: string
        }
        Update: {
          alert_id?: string
          id?: string
          platform?: string | null
          sent_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      push_notification_tokens: {
        Row: {
          created_at: string
          id: string
          platform: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      qogita_alerts: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          external_id: string | null
          id: string
          price: number | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          price?: number | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          price?: number | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      qogita_catalogue: {
        Row: {
          brand: string
          created_at: string
          ean: string
          id: string
          price_ht: number
          updated_at: string
        }
        Insert: {
          brand: string
          created_at?: string
          ean: string
          id?: string
          price_ht: number
          updated_at?: string
        }
        Update: {
          brand?: string
          created_at?: string
          ean?: string
          id?: string
          price_ht?: number
          updated_at?: string
        }
        Relationships: []
      }
      qogita_products: {
        Row: {
          alerts: string[] | null
          amazon_url: string | null
          created_at: string | null
          ean: string
          fba_profit: number | null
          fba_roi: number | null
          fbm_profit: number | null
          fbm_roi: number | null
          id: string
          qogita_price_ht: number
          qogita_price_ttc: number
          qogita_stock: number | null
          qogita_url: string | null
          selleramp_bsr: string | null
          selleramp_sale_price: number | null
          selleramp_sales: string | null
          selleramp_sellers: string | null
          selleramp_url: string | null
          selleramp_variations: string | null
          timestamp: string
          updated_at: string | null
        }
        Insert: {
          alerts?: string[] | null
          amazon_url?: string | null
          created_at?: string | null
          ean: string
          fba_profit?: number | null
          fba_roi?: number | null
          fbm_profit?: number | null
          fbm_roi?: number | null
          id?: string
          qogita_price_ht: number
          qogita_price_ttc: number
          qogita_stock?: number | null
          qogita_url?: string | null
          selleramp_bsr?: string | null
          selleramp_sale_price?: number | null
          selleramp_sales?: string | null
          selleramp_sellers?: string | null
          selleramp_url?: string | null
          selleramp_variations?: string | null
          timestamp: string
          updated_at?: string | null
        }
        Update: {
          alerts?: string[] | null
          amazon_url?: string | null
          created_at?: string | null
          ean?: string
          fba_profit?: number | null
          fba_roi?: number | null
          fbm_profit?: number | null
          fbm_roi?: number | null
          id?: string
          qogita_price_ht?: number
          qogita_price_ttc?: number
          qogita_stock?: number | null
          qogita_url?: string | null
          selleramp_bsr?: string | null
          selleramp_sale_price?: number | null
          selleramp_sales?: string | null
          selleramp_sellers?: string | null
          selleramp_url?: string | null
          selleramp_variations?: string | null
          timestamp?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      search_presets: {
        Row: {
          created_at: string | null
          filters: Json
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filters?: Json
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          filters?: Json
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      search_results_cache: {
        Row: {
          created_at: string | null
          expires_at: string | null
          filters_hash: string
          id: string
          provider: string
          results: Json
          results_count: number | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          filters_hash: string
          id?: string
          provider?: string
          results?: Json
          results_count?: number | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          filters_hash?: string
          id?: string
          provider?: string
          results?: Json
          results_count?: number | null
        }
        Relationships: []
      }
      subscription_engagements: {
        Row: {
          created_at: string
          custom_monthly_amount: number | null
          engagement_months: number
          id: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_monthly_amount?: number | null
          engagement_months?: number
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_monthly_amount?: number | null
          engagement_months?: number
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          apple_transaction_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_trial: boolean | null
          payment_provider: string | null
          plan_type: string
          started_at: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_used: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          apple_transaction_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_trial?: boolean | null
          payment_provider?: string | null
          plan_type: string
          started_at?: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_used?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          apple_transaction_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_trial?: boolean | null
          payment_provider?: string | null
          plan_type?: string
          started_at?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_used?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      suite_purchases: {
        Row: {
          amount: number
          created_at: string
          email: string
          id: string
          stripe_session_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          email: string
          id?: string
          stripe_session_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          email?: string
          id?: string
          stripe_session_id?: string | null
        }
        Relationships: []
      }
      supplier_survey_responses: {
        Row: {
          created_at: string
          id: string
          response: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          response: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          response?: string
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
      user_badge_counts: {
        Row: {
          badge_count: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          badge_count?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          badge_count?: number
          updated_at?: string | null
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
          user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string
          id?: string
          new_value?: string | null
          type: string
          used?: boolean
          user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          new_value?: string | null
          type?: string
          used?: boolean
          user_id?: string | null
        }
        Relationships: []
      }
      vibraforce_catalogue: {
        Row: {
          brand: string
          created_at: string
          ean: string
          id: string
          price_ht: number
          updated_at: string
        }
        Insert: {
          brand?: string
          created_at?: string
          ean: string
          id?: string
          price_ht: number
          updated_at?: string
        }
        Update: {
          brand?: string
          created_at?: string
          ean?: string
          id?: string
          price_ht?: number
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_bot_jobs: {
        Row: {
          account_phone: string
          contacts: Json
          created_at: string
          created_by: string | null
          id: string
          message_template: string
          progress: Json
          results: Json
          status: string
          updated_at: string
        }
        Insert: {
          account_phone: string
          contacts?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          message_template: string
          progress?: Json
          results?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          account_phone?: string
          contacts?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          message_template?: string
          progress?: Json
          results?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analysis_claim_next: {
        Args: { p_secret: string }
        Returns: {
          column_mapping: Json | null
          created_at: string | null
          error_message: string | null
          file_name: string
          file_path: string
          filters: Json
          id: string
          processing_duration_ms: number | null
          results_count: number | null
          status: string
          total_rows: number | null
          updated_at: string | null
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "file_analyses"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      analysis_complete: {
        Args: {
          p_count: number
          p_duration_ms: number
          p_id: string
          p_mapping: Json
          p_secret: string
          p_total: number
        }
        Returns: undefined
      }
      analysis_fail: {
        Args: { p_error: string; p_id: string; p_secret: string }
        Returns: undefined
      }
      analysis_insert_results: {
        Args: { p_analysis_id: string; p_results: Json; p_secret: string }
        Returns: undefined
      }
      bridge_claim_next_search: {
        Args: { p_secret: string }
        Returns: {
          cache_hit: boolean | null
          created_at: string | null
          error_message: string | null
          expires_at: string | null
          filters: Json
          filters_hash: string
          id: string
          name: string
          processing_duration_ms: number | null
          provider: string
          results_count: number | null
          results_summary: Json | null
          status: string
          updated_at: string | null
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "product_searches"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      bridge_complete_search: {
        Args: {
          p_count: number
          p_duration_ms: number
          p_id: string
          p_secret: string
          p_summary: Json
        }
        Returns: undefined
      }
      bridge_fail_search: {
        Args: { p_error: string; p_id: string; p_secret: string }
        Returns: undefined
      }
      bridge_upsert_cache: {
        Args: {
          p_count: number
          p_expires_at: string
          p_filters_hash: string
          p_results: Json
          p_secret: string
        }
        Returns: undefined
      }
      check_and_expire_subscriptions: { Args: never; Returns: undefined }
      cleanup_expired_impersonation_tokens: { Args: never; Returns: undefined }
      generate_affiliate_referral_code: { Args: never; Returns: string }
      get_admin_user_id: { Args: never; Returns: string }
      get_all_notification_counts: {
        Args: { user_id_param: string }
        Returns: Json
      }
      get_eany_brands: {
        Args: never
        Returns: {
          brand: string
        }[]
      }
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
      get_qogita_brands: {
        Args: never
        Returns: {
          brand: string
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
      get_vibraforce_brands: {
        Args: never
        Returns: {
          brand: string
        }[]
      }
      has_open_ticket: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_used_trial: { Args: { _user_id: string }; Returns: boolean }
      increment_user_badge: { Args: { user_id_param: string }; Returns: number }
      is_affiliate_admin: { Args: { _email: string }; Returns: boolean }
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
      mark_product_find_alerts_as_read: {
        Args: { source_filter?: string }
        Returns: undefined
      }
      mark_ticket_messages_as_read: {
        Args: { ticket_id_param: string }
        Returns: undefined
      }
      mp_claim_next: {
        Args: { p_secret: string }
        Returns: {
          country_code: string
          created_at: string
          error_message: string | null
          id: string
          processing_ms: number | null
          profile_id: string | null
          query_input: string
          query_type: string
          results_count: number | null
          status: string
          updated_at: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "mp_lookups"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      mp_complete: {
        Args: {
          p_id: string
          p_processing_ms: number
          p_results: Json
          p_secret: string
        }
        Returns: undefined
      }
      mp_fail: {
        Args: { p_error: string; p_id: string; p_secret: string }
        Returns: undefined
      }
      mp_get_cache: {
        Args: {
          p_asin: string
          p_country_code: string
          p_max_age_hours: number
          p_secret: string
        }
        Returns: Json
      }
      mp_upsert_cache: {
        Args: {
          p_asin: string
          p_country_code: string
          p_raw_data: Json
          p_secret: string
        }
        Returns: undefined
      }
      reset_user_badge: { Args: { user_id_param: string }; Returns: undefined }
      whatsapp_bot_claim_next: {
        Args: never
        Returns: {
          account_phone: string
          contacts: Json
          created_at: string
          created_by: string | null
          id: string
          message_template: string
          progress: Json
          results: Json
          status: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "whatsapp_bot_jobs"
          isOneToOne: false
          isSetofReturn: true
        }
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
