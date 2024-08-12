import React from "react";
import { useImage } from "@/hooks/useImage";

type SmImageProps = {
  width?: number;
  height?: number;
};

const SmImage = ({ width = 316, height = 200 }: SmImageProps) => {
  const { src, alt } = useImage();

  return (
    <div
      className={`w-full h-auto aspect-[${width}/${height}] border border-brand-gray-300 rounded-lg overflow-hidden`}
    >
      <img src={src || ""} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

export default SmImage;
