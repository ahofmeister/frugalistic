export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null;
          created_at: string | null;
          division: Database["public"]["Enums"]["division"] | null;
          id: string;
          name: string | null;
          user_id: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string | null;
          division?: Database["public"]["Enums"]["division"] | null;
          id?: string;
          name?: string | null;
          user_id: string;
        };
        Update: {
          color?: string | null;
          created_at?: string | null;
          division?: Database["public"]["Enums"]["division"] | null;
          id?: string;
          name?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          firstName: string | null;
          id: string;
          lastName: string | null;
        };
        Insert: {
          firstName?: string | null;
          id: string;
          lastName?: string | null;
        };
        Update: {
          firstName?: string | null;
          id?: string;
          lastName?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          amount: number;
          category: string | null;
          created_at: string | null;
          datetime: string;
          description: string;
          id: string;
          recurring_transaction: string | null;
          type: Database["public"]["Enums"]["transaction_type"] | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          category?: string | null;
          created_at?: string | null;
          datetime?: string;
          description: string;
          id?: string;
          recurring_transaction?: string | null;
          type?: Database["public"]["Enums"]["transaction_type"] | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          category?: string | null;
          created_at?: string | null;
          datetime?: string;
          description?: string;
          id?: string;
          recurring_transaction?: string | null;
          type?: Database["public"]["Enums"]["transaction_type"] | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_category_fkey";
            columns: ["category"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_recurring_transaction_fkey";
            columns: ["recurring_transaction"];
            isOneToOne: false;
            referencedRelation: "transactions_recurring";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions_recurring: {
        Row: {
          amount: number;
          category: string | null;
          created_at: string | null;
          description: string;
          enabled: boolean | null;
          id: string;
          interval: Database["public"]["Enums"]["recurring_interval"] | null;
          next_run: string | null;
          type: Database["public"]["Enums"]["transaction_type"] | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          category?: string | null;
          created_at?: string | null;
          description: string;
          enabled?: boolean | null;
          id?: string;
          interval?: Database["public"]["Enums"]["recurring_interval"] | null;
          next_run?: string | null;
          type?: Database["public"]["Enums"]["transaction_type"] | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          category?: string | null;
          created_at?: string | null;
          description?: string;
          enabled?: boolean | null;
          id?: string;
          interval?: Database["public"]["Enums"]["recurring_interval"] | null;
          next_run?: string | null;
          type?: Database["public"]["Enums"]["transaction_type"] | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_recurring_category_fkey";
            columns: ["category"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_recurring_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      distinct_year_month: {
        Row: {
          month: number | null;
          year: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      available_months_and_years: {
        Args: Record<PropertyKey, never>;
        Returns: {
          month: number;
          year: number;
        }[];
      };
      division_total4: {
        Args: {
          p_year: number;
        };
        Returns: {
          month: number;
          year: number;
          division: Database["public"]["Enums"]["division"];
          total: number;
        }[];
      };
      insert_recurring_transaction: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      summary2: {
        Args: {
          p_year: number;
        };
        Returns: {
          month: number;
          year: number;
          income: number;
          expense: number;
        }[];
      };
      transaction_categories_total6: {
        Args: {
          year: number;
        };
        Returns: {
          name: string;
          color: string;
          month: number;
          total: number;
        }[];
      };
      transaction_type_total5: {
        Args: {
          year: number;
        };
        Returns: {
          month: number;
          income: number;
          expense: number;
          savings: number;
        }[];
      };
    };
    Enums: {
      division: "essentials" | "leisure" | "savings";
      recurring_interval: "monthly" | "annually";
      transaction_type: "income" | "expense" | "savings";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;
