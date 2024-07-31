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
      pg_stat_monitor: {
        Row: {
          application_name: string | null;
          blk_read_time: number | null;
          blk_write_time: number | null;
          bucket: number | null;
          bucket_start_time: string | null;
          calls: number | null;
          client_ip: unknown | null;
          cmd_type: number | null;
          cmd_type_text: string | null;
          comments: string | null;
          cpu_sys_time: number | null;
          cpu_user_time: number | null;
          datname: unknown | null;
          elevel: number | null;
          local_blks_dirtied: number | null;
          local_blks_hit: number | null;
          local_blks_read: number | null;
          local_blks_written: number | null;
          max_exec_time: number | null;
          max_plan_time: number | null;
          mean_exec_time: number | null;
          mean_plan_time: number | null;
          message: string | null;
          min_exec_time: number | null;
          min_plan_time: number | null;
          planid: string | null;
          plans_calls: number | null;
          query: string | null;
          query_plan: string | null;
          queryid: string | null;
          relations: string[] | null;
          resp_calls: string[] | null;
          rows_retrieved: number | null;
          shared_blks_dirtied: number | null;
          shared_blks_hit: number | null;
          shared_blks_read: number | null;
          shared_blks_written: number | null;
          sqlcode: string | null;
          state: string | null;
          state_code: number | null;
          stddev_exec_time: number | null;
          stddev_plan_time: number | null;
          temp_blks_read: number | null;
          temp_blks_written: number | null;
          top_query: string | null;
          top_queryid: string | null;
          toplevel: boolean | null;
          total_exec_time: number | null;
          total_plan_time: number | null;
          userid: unknown | null;
          wal_bytes: number | null;
          wal_fpi: number | null;
          wal_records: number | null;
        };
        Relationships: [];
      };
      pg_stat_monitor_settings: {
        Row: {
          default_value: string | null;
          description: string | null;
          maximum: number | null;
          minimum: number | null;
          name: string | null;
          options: string | null;
          restart: string | null;
          value: string | null;
        };
        Relationships: [];
      };
      transactions_by_division_summary_yearly: {
        Row: {
          month: number | null;
          total_amount: number | null;
          year: number | null;
        };
        Relationships: [];
      };
      transactions_totals: {
        Row: {
          expense: number | null;
          income: number | null;
          month: number | null;
          saving: number | null;
          year: number | null;
        };
        Relationships: [];
      };
      transactions_totals2: {
        Row: {
          expense: number | null;
          income: number | null;
          month: number | null;
          saving: number | null;
          year: number | null;
        };
        Relationships: [];
      };
      transactions_totals3: {
        Row: {
          expense: number | null;
          income: number | null;
          month: number | null;
          saving: number | null;
          year: number | null;
        };
        Relationships: [];
      };
      transactions_totals4: {
        Row: {
          expense: number | null;
          income: number | null;
          month: number | null;
          saving: number | null;
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
      categories_total_by_date: {
        Args: {
          datefrom: string;
          dateto: string;
        };
        Returns: {
          name: string;
          sum: number;
          month: number;
          year: number;
        }[];
      };
      category_total: {
        Args: {
          categoryid: number;
        };
        Returns: {
          sum: number;
          month: number;
          year: number;
        }[];
      };
      decode_error_level: {
        Args: {
          elevel: number;
        };
        Returns: string;
      };
      division_total: {
        Args: {
          p_year: number;
        };
        Returns: {
          month: number;
          year: number;
          division: string;
          total: number;
        }[];
      };
      division_total2: {
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
      division_total3: {
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
      generate_monthly_summary: {
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
      generate_monthly_summary2: {
        Args: {
          p_year: number;
        };
        Returns: {
          month: number;
          year: number;
          income: number;
          expense: number;
          savings: number;
        }[];
      };
      get_cmd_type: {
        Args: {
          cmd_type: number;
        };
        Returns: string;
      };
      get_histogram_timings: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_state: {
        Args: {
          state_code: number;
        };
        Returns: string;
      };
      histogram: {
        Args: {
          _bucket: number;
          _quryid: string;
        };
        Returns: Record<string, unknown>[];
      };
      insert_recurring_transaction: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      pg_stat_monitor_internal: {
        Args: {
          showtext: boolean;
        };
        Returns: Record<string, unknown>[];
      };
      pg_stat_monitor_reset: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      pg_stat_monitor_settings: {
        Args: Record<PropertyKey, never>;
        Returns: Record<string, unknown>[];
      };
      pg_stat_monitor_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      range: {
        Args: Record<PropertyKey, never>;
        Returns: string[];
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
      transaction_categories_total: {
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
      transaction_categories_total2: {
        Args: {
          year: number;
        };
        Returns: {
          name: string;
          month: number;
          total: number;
        }[];
      };
      transaction_categories_total3: {
        Args: {
          year: number;
        };
        Returns: {
          name: string;
          month: number;
          total: number;
        }[];
      };
      transaction_categories_total4: {
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
      transaction_categories_total5: {
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
      transaction_type_total: {
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
      transaction_type_total2: {
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
      transaction_type_total3: {
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
      transaction_type_total4: {
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
      transaction_year_summary: {
        Args: {
          year: number;
        };
        Returns: {
          month: number;
          incomes: number;
          expenses: number;
          savings: number;
        }[];
      };
      transactions_by_category: {
        Args: {
          datefrom: string;
          dateto: string;
        };
        Returns: {
          id: string;
          name: string;
          total: number;
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
