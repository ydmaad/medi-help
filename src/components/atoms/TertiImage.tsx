import React from "react";
import { useImage } from "@/hooks/useImage";

const TertiImage = () => {
  const { src, alt } = useImage();

  return (
    <div className="w-[316px] h-[200px] border border-brand-gray-300 rounded-[20px] overflow-hidden">
      <img src={src || ""} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

export default TertiImage;
