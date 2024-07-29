import React from "react";
import { useImage } from "@/hooks/useImage";

const SmImage = () => {
  const { src, alt } = useImage();

  return (
    <div className="w-[316px] h-[200px] border border-gray-300 rounded-lg overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

export default SmImage;
