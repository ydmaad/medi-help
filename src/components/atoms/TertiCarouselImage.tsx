import React from "react";
import { useImage } from "@/hooks/useImage";

const TertiCarouselImage = () => {
  const { src, alt } = useImage();

  return (
    <div className="w-[247px] h-[160px]  rounded-[16px] overflow-hidden">
      <img src={src || ""} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

export default TertiCarouselImage;
