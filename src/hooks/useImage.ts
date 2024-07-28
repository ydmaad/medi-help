import { useContext } from "react";
import ImageContext from "@/contexts/ImageContext";

export const useImage = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("Image 에러 메시지 입니다.");
  }
  return context;
};
