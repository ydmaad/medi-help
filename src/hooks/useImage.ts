import { useContext } from "react";
import ImageContext from "@/contexts/ImageContext";

export const useImage = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("Image 프로바이더 안에서만 작동됩니다");
  }
  return context;
};
