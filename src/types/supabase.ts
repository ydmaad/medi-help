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
          medi_name: string[];
          medi_time: string;
          side_effect: string;
          start_date: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          medi_name: string[];
          medi_time: string;
          side_effect: string;
          start_date?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          medi_name?: string[];
          medi_time?: string;
          side_effect?: string;
          start_date?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "calendar_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      comments: {
        Row: {
          comment: string;
          created_at: string;
          id: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          comment: string;
          created_at?: string;
          id?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          comment?: string;
          created_at?: string;
          id?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      magazine: {
        Row: {
          descriptions: string;
          id: string;
          imgs_url: string;
          reporting_date: string | null;
          subtitle: string;
          title: string;
          written_by: string | null;
        };
        Insert: {
          descriptions: string;
          id?: string;
          imgs_url: string;
          reporting_date?: string | null;
          subtitle: string;
          title: string;
          written_by?: string | null;
        };
        Update: {
          descriptions?: string;
          id?: string;
          imgs_url?: string;
          reporting_date?: string | null;
          subtitle?: string;
          title?: string;
          written_by?: string | null;
        };
        Relationships: [];
      };
      medications: {
        Row: {
          created_at: string | null;
          end_date: string | null;
          id: string;
          medi_name: string;
          medi_nickname: string | null;
          notes: string | null;
          start_date: string | null;
          times: Json;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          end_date?: string | null;
          id?: string;
          medi_name: string;
          medi_nickname?: string | null;
          notes?: string | null;
          start_date?: string | null;
          times: Json;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          end_date?: string | null;
          id?: string;
          medi_name?: string;
          medi_nickname?: string | null;
          notes?: string | null;
          start_date?: string | null;
          times?: Json;
          user_id?: string | null;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          contents: string;
          created_at: string;
          id: string;
          img_url: string | null;
          title: string;
          user_id: string;
        };
        Insert: {
          contents: string;
          created_at?: string;
          id?: string;
          img_url?: string | null;
          title: string;
          user_id?: string;
        };
        Update: {
          contents?: string;
          created_at?: string;
          id?: string;
          img_url?: string | null;
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
      search_medicine: {
        Row: {
          atpnQesitm: string | null;
          atpnWarnQesitm: string | null;
          depositMethodQesitm: string | null;
          efcyQesitm: string | null;
          entpName: string;
          id: number;
          intrcQesitm: string | null;
          itemImage: string | null;
          itemName: string | null;
          itemSeq: string | null;
          seQesitm: string | null;
          useMethodQesitm: string | null;
        };
        Insert: {
          atpnQesitm?: string | null;
          atpnWarnQesitm?: string | null;
          depositMethodQesitm?: string | null;
          efcyQesitm?: string | null;
          entpName: string;
          id?: number;
          intrcQesitm?: string | null;
          itemImage?: string | null;
          itemName?: string | null;
          itemSeq?: string | null;
          seQesitm?: string | null;
          useMethodQesitm?: string | null;
        };
        Update: {
          atpnQesitm?: string | null;
          atpnWarnQesitm?: string | null;
          depositMethodQesitm?: string | null;
          efcyQesitm?: string | null;
          entpName?: string;
          id?: number;
          intrcQesitm?: string | null;
          itemImage?: string | null;
          itemName?: string | null;
          itemSeq?: string | null;
          seQesitm?: string | null;
          useMethodQesitm?: string | null;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          endpoint: string;
          expirationTime: string | null;
          id: string;
          keys: Json | null;
        };
        Insert: {
          endpoint: string;
          expirationTime?: string | null;
          id?: string;
          keys?: Json | null;
        };
        Update: {
          endpoint?: string;
          expirationTime?: string | null;
          id?: string;
          keys?: Json | null;
        };
        Relationships: [];
      };
      user_medicine: {
        Row: {
          medicine_id: string;
          user_id: string;
        };
        Insert: {
          medicine_id?: string;
          user_id: string;
        };
        Update: {
          medicine_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_medicine_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          avatar: string | null;
          created_at: string;
          email: string;
          id: string;
          nickname: string | null;
        };
        Insert: {
          avatar?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          nickname?: string | null;
        };
        Update: {
          avatar?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          nickname?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
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
