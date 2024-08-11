// src/store/auth.ts

import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// 데이터베이스의 users 테이블 행 타입 정의
type UserData = Database["public"]["Tables"]["users"]["Row"];

// AuthUser 타입은 Supabase의 User 타입과 우리 데이터베이스의 user 정보를 합친 것입니다.
export type AuthUser = User & UserData;

// AuthState 인터페이스는 인증 관련 상태와 액션을 정의합니다.
interface AuthState {
  user: AuthUser | null; // 현재 로그인한 사용자 정보
  setUser: (user: AuthUser | null) => void; // 사용자 정보를 설정하는 함수
  clearAuth: () => void; // 인증 정보를 초기화하는 함수
}

// Zustand를 사용하여 전역 상태 스토어를 생성합니다.
export const useAuthStore = create<AuthState>((set) => ({
  // 초기 상태: 사용자 정보 없음
  user: null,

  // 사용자 정보를 설정하는 액션
  setUser: (user) => set(() => ({ user })),

  // 인증 정보를 초기화하는 액션 (로그아웃 시 사용)
  clearAuth: () => set(() => ({ user: null })),
}));

// 기존 코드
// import { Tables } from "@/types/supabase";
// import { create } from "zustand";

// type User = Tables<"users">;

// interface AuthState {
//   user: User | null;
//   setUser: (user: User | null) => void;
//   clearAuth: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   setUser: (user) => set({ user }),
//   clearAuth: () => set({ user: null }),
// }));
