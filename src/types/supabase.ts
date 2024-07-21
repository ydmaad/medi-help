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
      calendar: {
        Row: {
          created_at: string;
          id: string;
          medi_name: string;
          medi_time: string;
          side_effect: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          medi_name: string;
          medi_time: string;
          side_effect: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          medi_name?: string;
          medi_time?: string;
          side_effect?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      column: {
        Row: {
          descriptions: string;
          id: string;
          imgs_url: string;
          subtitle: string;
          title: string;
        };
        Insert: {
          descriptions: string;
          id?: string;
          imgs_url: string;
          subtitle: string;
          title: string;
        };
        Update: {
          descriptions?: string;
          id?: string;
          imgs_url?: string;
          subtitle?: string;
          title?: string;
        };
        Relationships: [];
      };
      medicine: {
        Row: {
          id: string;
          medi_description: string;
          medi_name: string;
        };
        Insert: {
          id?: string;
          medi_description: string;
          medi_name: string;
        };
        Update: {
          id?: string;
          medi_description?: string;
          medi_name?: string;
        };
        Relationships: [];
      };
      pill_alarm: {
        Row: {
          alarm_description: string;
          alarm_name: string;
          alarm_time: string;
          created_at: string;
          id: string;
          medi_name: string;
          user_id: string;
        };
        Insert: {
          alarm_description: string;
          alarm_name: string;
          alarm_time: string;
          created_at?: string;
          id?: string;
          medi_name: string;
          user_id?: string;
        };
        Update: {
          alarm_description?: string;
          alarm_name?: string;
          alarm_time?: string;
          created_at?: string;
          id?: string;
          medi_name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          avatar: string;
          contents: string;
          created_at: string;
          id: string;
          img_url: string;
          nickname: string;
          title: string;
          user_id: string;
        };
        Insert: {
          avatar: string;
          contents: string;
          created_at?: string;
          id?: string;
          img_url: string;
          nickname: string;
          title: string;
          user_id?: string;
        };
        Update: {
          avatar?: string;
          contents?: string;
          created_at?: string;
          id?: string;
          img_url?: string;
          nickname?: string;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      user_medicine: {
        Row: {
          medicine_id: string;
          user_id: string;
        };
        Insert: {
          medicine_id?: string;
          user_id?: string;
        };
        Update: {
          medicine_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatar: string;
          created_at: string;
          email: string;
          id: string;
          nickname: string;
        };
        Insert: {
          avatar: string;
          created_at?: string;
          email: string;
          id?: string;
          nickname: string;
        };
        Update: {
          avatar?: string;
          created_at?: string;
          email?: string;
          id?: string;
          nickname?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
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
    : never = never
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
    : never = never
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
    : never = never
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
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
