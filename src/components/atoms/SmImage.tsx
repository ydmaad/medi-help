import React from "react";
import { useImage } from "@/hooks/useImage";
import Image from "next/image";

type SmImageProps = {
  className?: string;
};

const SmImage = ({ className = "" }: SmImageProps) => {
  const { src, alt } = useImage();

  return (
    <div
      className={`relative ${className} overflow-hidden border border-brand-gray-300 rounded-lg`}
    >
      <Image
        src={src || "/placeholder.png"}
        alt={alt || "Image"}
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
};

export default SmImage;
