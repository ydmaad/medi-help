import { useContext } from "react";
import BarTextContext from "@/contexts/BarTextContext"; // 수정된 경로

export const useBarText = () => {
  const context = useContext(BarTextContext); // 수정된 부분
  if (!context) {
    throw new Error("테스트 에러 메시지 입니다.");
  }
  return context;
};
