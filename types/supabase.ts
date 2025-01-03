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
      categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          division: Database["public"]["Enums"]["division"] | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          division?: Database["public"]["Enums"]["division"] | null
          id?: string
          name: string
          user_id?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          division?: Database["public"]["Enums"]["division"] | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string | null
          id: string
          response: string | null
          status: string | null
          text: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          response?: string | null
          status?: string | null
          text: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          response?: string | null
          status?: string | null
          text?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profile: {
        Row: {
          email: string | null
          firstName: string | null
          id: string
          lastName: string | null
        }
        Insert: {
          email?: string | null
          firstName?: string | null
          id?: string
          lastName?: string | null
        }
        Update: {
          email?: string | null
          firstName?: string | null
          id?: string
          lastName?: string | null
        }
        Relationships: []
      }
      setting: {
        Row: {
          date_format: string
          id: string
          user_id: string
        }
        Insert: {
          date_format?: string
          id?: string
          user_id?: string
        }
        Update: {
          date_format?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          datetime: string
          description: string
          id: string
          recurring_transaction: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          datetime?: string
          description: string
          id?: string
          recurring_transaction?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          datetime?: string
          description?: string
          id?: string
          recurring_transaction?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_recurring_transaction_fkey"
            columns: ["recurring_transaction"]
            isOneToOne: false
            referencedRelation: "transactions_recurring"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions_recurring: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string
          enabled: boolean
          id: string
          interval: Database["public"]["Enums"]["recurring_interval"]
          next_run: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          description: string
          enabled?: boolean
          id?: string
          interval: Database["public"]["Enums"]["recurring_interval"]
          next_run?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string
          enabled?: boolean
          id?: string
          interval?: Database["public"]["Enums"]["recurring_interval"]
          next_run?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_recurring_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      transaction_auto_suggest2: {
        Row: {
          category: string | null
          color: string | null
          description: string | null
          frequency: number | null
          name: string | null
          type: Database["public"]["Enums"]["transaction_type"] | null
          unique_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_category_totals: {
        Args: {
          from_date: string
          to_date: string
        }
        Returns: {
          name: string
          color: string
          total: number
        }[]
      }
      get_category_totals2: {
        Args: {
          from_date: string
          to_date: string
        }
        Returns: {
          name: string
          total: number
        }[]
      }
      get_expenses_total_by_category: {
        Args: {
          year: number
        }
        Returns: {
          category_name: string
          category_color: string
          month: number
          total: number
        }[]
      }
      get_min_and_max_year: {
        Args: Record<PropertyKey, never>
        Returns: {
          minyear: number
          maxyear: number
        }[]
      }
      get_total_by_type_and_year: {
        Args: {
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          transaction_year: number
        }
        Returns: {
          total: number
        }[]
      }
      insert_recurring_transaction: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      transaction_type_total: {
        Args: {
          year: number
        }
        Returns: {
          month: number
          income: number
          expense: number
          savings: number
        }[]
      }
    }
    Enums: {
      division: "essentials" | "leisure" | "savings"
      feedback_status: "new" | "resolved" | "closed"
      onboarding_status: "current" | "complete" | "skip" | "open"
      onboarding_step: "categories" | "welcome"
      recurring_interval: "monthly" | "annually"
      setting_key: "date_format"
      transaction_type: "income" | "expense" | "savings"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
