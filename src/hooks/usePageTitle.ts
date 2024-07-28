import { useContext } from "react";
import PageTitleContext from "@/contexts/PageTitleContext";

export const usePageTitle = () => {
  const context = useContext(PageTitleContext);
  if (!context) {
    throw new Error("usePageTitle 프로바이더 안에서만 작동됩니다.");
  }
  return context;
};
