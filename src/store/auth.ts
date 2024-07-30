import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { Tables } from "@/types/supabase";

type UserProfile = Tables<"users">;

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  clearAuth: () => set({ user: null, profile: null }),
}));

// 주스탠드 사용시 주석해제
