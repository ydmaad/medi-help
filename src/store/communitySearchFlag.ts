// src/store/auth.ts

import { create } from "zustand";

// AuthState 인터페이스는 인증 관련 상태와 액션을 정의합니다.
interface CommunitySearchFlagState {
  isSearchOpen: boolean;
  setIsSearchOpen: (boolean: boolean) => void;
}

// Zustand를 사용하여 전역 상태 스토어를 생성합니다.
export const useCommunitySearchFlagStore = create<CommunitySearchFlagState>(
  (set) => ({
    isSearchOpen: false,
    setIsSearchOpen: (boolean) => set(() => ({ isSearchOpen: boolean })),
  })
);
