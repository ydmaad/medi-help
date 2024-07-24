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
      calendar: {
        Row: {
          created_at: string
          id: string
          medi_name: string
          medi_time: string
          side_effect: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          medi_name: string
          medi_time: string
          side_effect: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          medi_name?: string
          medi_time?: string
          side_effect?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_medi_name_fkey"
            columns: ["medi_name"]
            isOneToOne: true
            referencedRelation: "medicine"
            referencedColumns: ["medi_name"]
          },
          {
            foreignKeyName: "calendar_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      column: {
        Row: {
          descriptions: string
          id: string
          imgs_url: string
          subtitle: string
          title: string
        }
        Insert: {
          descriptions: string
          id?: string
          imgs_url: string
          subtitle: string
          title: string
        }
        Update: {
          descriptions?: string
          id?: string
          imgs_url?: string
          subtitle?: string
          title?: string
        }
        Relationships: []
      }
      medicine: {
        Row: {
          id: string
          medi_description: string
          medi_name: string
        }
        Insert: {
          id?: string
          medi_description: string
          medi_name: string
        }
        Update: {
          id?: string
          medi_description?: string
          medi_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "medicine_medi_name_fkey"
            columns: ["medi_name"]
            isOneToOne: true
            referencedRelation: "pill_alarm"
            referencedColumns: ["medi_name"]
          },
        ]
      }
      pill_alarm: {
        Row: {
          alarm_description: string
          alarm_name: string
          alarm_time: string
          created_at: string
          id: string
          medi_name: string
          user_id: string
        }
        Insert: {
          alarm_description: string
          alarm_name: string
          alarm_time: string
          created_at?: string
          id?: string
          medi_name?: string
          user_id: string
        }
        Update: {
          alarm_description?: string
          alarm_name?: string
          alarm_time?: string
          created_at?: string
          id?: string
          medi_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pill_alarm_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          avatar: string
          contents: string
          created_at: string
          id: string
          img_url: string
          nickname: string
          title: string
          user_id: string
        }
        Insert: {
          avatar: string
          contents: string
          created_at?: string
          id?: string
          img_url: string
          nickname: string
          title: string
          user_id?: string
        }
        Update: {
          avatar?: string
          contents?: string
          created_at?: string
          id?: string
          img_url?: string
          nickname?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_nickname_fkey"
            columns: ["nickname"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["nickname"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      test_posts: {
        Row: {
          avatar: string
          contents: string
          created_at: string
          id: number
          img_url: string
          nickname: string
          title: string
          user_id: number
        }
        Insert: {
          avatar: string
          contents: string
          created_at?: string
          id?: number
          img_url: string
          nickname: string
          title: string
          user_id: number
        }
        Update: {
          avatar?: string
          contents?: string
          created_at?: string
          id?: number
          img_url?: string
          nickname?: string
          title?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_posts_avatar_fkey"
            columns: ["avatar"]
            isOneToOne: false
            referencedRelation: "test_user"
            referencedColumns: ["avatar"]
          },
          {
            foreignKeyName: "test_posts_nickname_fkey"
            columns: ["nickname"]
            isOneToOne: false
            referencedRelation: "test_user"
            referencedColumns: ["nickname"]
          },
          {
            foreignKeyName: "test_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "test_user"
            referencedColumns: ["id"]
          },
        ]
      }
      test_user: {
        Row: {
          avatar: string
          created_at: string
          email: string
          id: number
          nickname: string
        }
        Insert: {
          avatar: string
          created_at?: string
          email: string
          id?: number
          nickname: string
        }
        Update: {
          avatar?: string
          created_at?: string
          email?: string
          id?: number
          nickname?: string
        }
        Relationships: []
      }
      user_medicine: {
        Row: {
          medicine_id: string
          user_id: string
        }
        Insert: {
          medicine_id?: string
          user_id: string
        }
        Update: {
          medicine_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_medicine_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicine"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_medicine_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string
          created_at: string
          email: string
          id: string
          nickname: string
        }
        Insert: {
          avatar: string
          created_at?: string
          email: string
          id?: string
          nickname: string
        }
        Update: {
          avatar?: string
          created_at?: string
          email?: string
          id?: string
          nickname?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_avatar_fkey"
            columns: ["avatar"]
            isOneToOne: true
            referencedRelation: "posts"
            referencedColumns: ["avatar"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
