import { useContext } from "react";
import BarTextContext from "@/contexts/BarTextContext";

export const useBarText = () => {
  const context = useContext(BarTextContext);
  if (!context) {
    throw new Error("BarText 에러 메시지 입니다.");
  }
  return context;
};
