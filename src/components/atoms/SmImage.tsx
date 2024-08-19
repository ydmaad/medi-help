import React, { useState, useEffect } from "react";
import { useImage } from "@/hooks/useImage";

type SmImageProps = {
  className?: string;
};

const SmImage = ({ className = "" }: SmImageProps) => {
  const { src, alt } = useImage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoading(false);
      img.onerror = () => setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [src]);

  return (
    <div
      className={`w-full h-auto border border-brand-gray-300 rounded-lg overflow-hidden ${className}`}
    >
      {isLoading ? (
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
      ) : (
        <img src={src || ""} alt={alt} className="w-full h-full object-cover" />
      )}
    </div>
  );
};

export default SmImage;
