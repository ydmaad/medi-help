import { useContext } from "react";
import BarTextContext from "@/contexts/BarTextContext";

export const useBarText = () => {
  const context = useContext(BarTextContext);
  if (!context) {
    throw new Error("BarText 프로바이더 안에서만 작동됩니다");
  }
  return context;
};
