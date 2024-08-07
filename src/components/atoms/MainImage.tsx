import React from "react";
import { useImage } from "@/hooks/useImage";

const MainImage = () => {
  const { src, alt } = useImage();

  return (
    <div className="w-full max-w-[1360px] aspect-[588/280] border border-brand-gray-300 rounded-[20px] overflow-hidden">
      <img src={src || ""} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

export default MainImage;
